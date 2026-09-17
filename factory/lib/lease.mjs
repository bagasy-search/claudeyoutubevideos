// lease.mjs — SEMÁFOROS de recursos compartidos entre sesiones/videos.
//
// Medido (11-15 sep 2026): agnes 429 con dos videos a la vez (fcspellizco+fcscanas, ~1 h perdida),
// slots del farm repartidos a ciegas, sesiones borrando/llenando disco de otras.
//
// Backend por defecto: directorio de locks en disco local (todas las sesiones de ESTA máquina lo ven).
//   <LEASE_DIR>/<recurso>/<holder>.json = { holder, units, expiresAt, pid, host }
// Adquisición atómica con un mutex por recurso (mkdir es atómico en NTFS y POSIX).
// Un lease vencido (proceso muerto, sesión cortada) se ignora y se limpia solo.
// Backend Supabase (dos máquinas): ver factory/sql/factory_leases.sql — mismo contrato.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { env } from "./env.mjs";

export const CAPACIDAD = {
  agnes: () => Number(env("FACTORY_CAP_AGNES") || Math.max(1, (env("AGNES_KEYS") || "").split(",").filter(Boolean).length || 1)),
  runpod: () => Number(env("FACTORY_CAP_RUNPOD") || 4),
  openai_batch: () => Number(env("FACTORY_CAP_OPENAI") || 4),
  fish: () => Number(env("FACTORY_CAP_FISH") || 3),
  farm_slots: () => Number(env("FACTORY_CAP_FARM") || 60),
  modal: () => Number(env("FACTORY_CAP_MODAL") || 4),
};

const LEASE_DIR = () => env("FACTORY_LEASE_DIR") || path.join(os.tmpdir(), "factory_leases");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withMutex(dir, fn, { timeoutMs = 30_000 } = {}) {
  const m = path.join(dir, ".mutex");
  const t0 = Date.now();
  for (;;) {
    try { fs.mkdirSync(m); break; } catch (e) {
      if (e.code !== "EEXIST") throw e;
      // mutex huérfano (>60 s): se rompe
      try { if (Date.now() - fs.statSync(m).mtimeMs > 60_000) { fs.rmdirSync(m); continue; } } catch { /* carrera */ }
      if (Date.now() - t0 > timeoutMs) throw new Error(`mutex de ${dir} ocupado > ${timeoutMs} ms`);
      await sleep(25 + Math.random() * 50);
    }
  }
  try { return await fn(); } finally { try { fs.rmdirSync(m); } catch { /* ya no está */ } }
}

function vivos(dir) {
  const now = Date.now();
  const out = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (!f.endsWith(".json")) continue;
    const p = path.join(dir, f);
    try {
      const l = JSON.parse(fs.readFileSync(p, "utf8"));
      if (l.expiresAt > now) out.push(l); else fs.unlinkSync(p);
    } catch { try { fs.unlinkSync(p); } catch { /* nada */ } }
  }
  return out;
}

export function usage(recurso, { dir = LEASE_DIR() } = {}) {
  const d = path.join(dir, recurso);
  const ls = vivos(d);
  const cap = CAPACIDAD[recurso] ? CAPACIDAD[recurso]() : Infinity;
  return { recurso, capacidad: cap, usado: ls.reduce((a, l) => a + l.units, 0), holders: ls.map((l) => `${l.holder}×${l.units}`) };
}

/**
 * tryAcquire(recurso, holder, units) → lease | null (sin esperar)
 * acquire(...)  → espera hasta conseguirlo (o `waitMs`), con heartbeat automático.
 */
export async function tryAcquire(recurso, holder, units = 1, { ttlMs = 10 * 60_000, dir = LEASE_DIR(), capacidad } = {}) {
  const d = path.join(dir, recurso);
  fs.mkdirSync(d, { recursive: true });
  const cap = capacidad ?? (CAPACIDAD[recurso] ? CAPACIDAD[recurso]() : Infinity);
  if (units > cap) throw new Error(`lease ${recurso}: pide ${units} y la capacidad total es ${cap}`);
  return withMutex(d, async () => {
    const ls = vivos(d).filter((l) => l.holder !== holder);
    const usado = ls.reduce((a, l) => a + l.units, 0);
    if (usado + units > cap) return null;
    const lease = { recurso, holder, units, expiresAt: Date.now() + ttlMs, pid: process.pid, host: os.hostname(), ttlMs };
    fs.writeFileSync(path.join(d, `${holder.replace(/[^\w.-]/g, "_")}.json`), JSON.stringify(lease));
    return makeHandle(lease, d);
  });
}

function makeHandle(lease, d) {
  const file = path.join(d, `${lease.holder.replace(/[^\w.-]/g, "_")}.json`);
  const h = { ...lease, perdido: false };
  const hb = setInterval(() => {
    // ⛔ El latido NO puede RESUCITAR un lease reclamado. Antes reescribía el archivo sin mirar nada:
    // si este tenedor se atrasaba más que su TTL, `vivos()` lo barría, OTRO proceso tomaba la
    // capacidad legítimamente, y al volver el atrasado se re-creaba el archivo encima → los dos
    // corriendo. Medido 16-sep con agnes: cmealter×14 + cmecaja×14 = 28 sobre una capacidad de 14,
    // los dos PIDs vivos. `tryAcquire` estaba bien; el que se salteaba el chequeo era esto.
    try {
      if (!fs.existsSync(file)) { h.perdido = true; clearInterval(hb); return; }
      const actual = JSON.parse(fs.readFileSync(file, "utf8"));
      if (actual.pid !== lease.pid || actual.host !== lease.host) { h.perdido = true; clearInterval(hb); return; }
      lease.expiresAt = Date.now() + lease.ttlMs;
      fs.writeFileSync(file, JSON.stringify(lease));
    } catch { /* nada */ }
  }, Math.max(1000, Math.floor(lease.ttlMs / 3)));
  hb.unref();
  h.release = () => { clearInterval(hb); try { fs.unlinkSync(file); } catch { /* ya liberado */ } };
  return h;
}

export async function acquire(recurso, holder, units = 1, { waitMs = 6 * 3600_000, pollMs = 5000, log = console.log, ...o } = {}) {
  const t0 = Date.now();
  let avisado = false;
  for (;;) {
    const l = await tryAcquire(recurso, holder, units, o);
    if (l) { if (avisado) log(`lease ${recurso}: conseguido tras ${Math.round((Date.now() - t0) / 1000)} s`); return l; }
    if (!avisado) { const u = usage(recurso, o); log(`lease ${recurso}: esperando ${units} (usado ${u.usado}/${u.capacidad} por ${u.holders.join(", ")})`); avisado = true; }
    if (Date.now() - t0 > waitMs) throw new Error(`lease ${recurso}: no se liberó en ${Math.round(waitMs / 60000)} min`);
    await sleep(pollMs);
  }
}

/** Ejecuta fn con el lease tomado y SIEMPRE lo libera. */
export async function withLease(recurso, holder, units, fn, o = {}) {
  const l = await acquire(recurso, holder, units, o);
  try {
    const r = await fn(l);
    // Si mientras corríamos nos reclamaron el lease, lo decimos: el trabajo puede haberse solapado
    // con otro tenedor (429 y gasto doble). No se rompe el resultado, pero no se calla.
    if (l.perdido) (o.log || console.log)(`⚠️ lease ${recurso}/${holder}: fue reclamado durante la corrida (pudo haber otro tenedor a la vez)`);
    return r;
  } finally { l.release(); }
}
