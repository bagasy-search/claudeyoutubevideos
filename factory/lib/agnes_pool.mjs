// agnes_pool.mjs — RESERVA DE CLAVES DE AGNES COMPARTIDA entre TODOS los procesos de la PC (todas las sesiones/nichos).
//
// Por qué (medido 30-sep-2026): el límite de agnes es POR CLAVE gratuita = 1 video/minuto ("You've reached the API rate
// limit for free users"), no por IP. Cada script llevaba su propia cuenta → varios procesos usaban la MISMA clave en el
// mismo minuto y se bloqueaban solos, mientras otras claves estaban ociosas (usábamos ~1% de lo permitido).
// Esta librería reparte las claves entre procesos con un estado en disco (lock por mkdir, atómico en Windows):
//   · cada clave se usa como mucho 1 vez cada 61 s (entre TODOS los procesos)
//   · "free users" / rate → esa clave descansa 65 s · cola llena → TODOS esperan 10 s (es global del servidor)
//   · varios clips en vuelo por clave (el límite es de ENVÍO, no de clips corriendo)
//   · la consulta de estado va con la MISMA clave que envió (si no, 404 "task not found")
//   · cada rechazo queda anotado con su motivo → `node factory/lib/agnes_pool.mjs stats`
//
// Uso:
//   import { agnesSubmit, agnesWait, agnesGenerate } from ".../factory/lib/agnes_pool.mjs";
//   const { vid, key } = await agnesSubmit(body, { tag: "hhjanitor s0_01" });      // body = JSON del POST /v1/videos
//   const r = await agnesWait(vid, key, { model: body.model });                     // → { url } | { error }
//   await agnesGenerate(body, "out.mp4", { tag })                                   // envía + espera + baja
// Claves = AGNES_KEYS del .env de video2 MENOS AGNES_KEYS_OTRA_PC (reservadas para la otra PC).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ENVF = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env");
const env = {};
// .env: el del repo/worktree, el del directorio actual, o el de la copia principal (los worktrees a veces no lo tienen)
for (const f of [ENVF, path.resolve(".env"), "C:/Users/bauti/Downloads/video2/.env"]) {
  try { for (const l of fs.readFileSync(f, "utf8").split(/\r?\n/)) { const i = l.indexOf("="); if (i > 0 && !l.startsWith("#")) env[l.slice(0, i).trim()] ??= l.slice(i + 1).trim().replace(/^["']|["']$/g, ""); } } catch {}
  if (env.AGNES_KEYS) break;
}
const split = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
const RES = new Set(split(process.env.AGNES_KEYS_OTRA_PC || env.AGNES_KEYS_OTRA_PC));
export const KEYS = split(process.env.AGNES_KEYS || env.AGNES_KEYS || env.AGNES_KEY).filter((k) => !RES.has(k));
const B = "https://apihub.agnes-ai.com/v1", ROOT = "https://apihub.agnes-ai.com";
const DIR = process.env.AGNES_POOL_DIR || (fs.existsSync("D:/") ? "D:/rtmp/agnes_pool" : path.join(os.tmpdir(), "agnes_pool"));
fs.mkdirSync(DIR, { recursive: true });
const ST = path.join(DIR, "state.json"), LOCK = path.join(DIR, "lock"), LOG = path.join(DIR, "log.jsonl");
const GAP = 61_000, RATE_REST = 65_000, QUEUE_REST = Number(process.env.AGNES_QUEUE_REST_MS || 500), IP_REST = 30_000, QUOTA_REST = 185_000;  // cola llena: 0,5 s (creador 2-oct: más intentos = más lugares agarrados; medido 1→40 clips/h, 0 bloqueos por ráfaga)
const MIN_SPACING = Number(process.env.AGNES_SPACING_MS || 500); // entre DOS envíos cualesquiera de la PC ("rate exceeds the limit" = ráfaga)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hk = (k) => crypto.createHash("sha1").update(k).digest("hex").slice(0, 10);

async function locked(fn) {
  for (let t = 0; ; t++) {
    try { fs.mkdirSync(LOCK); break; } catch {
      try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 10_000) fs.rmdirSync(LOCK); } catch {}
      await sleep(30 + Math.random() * 40);
    }
  }
  try {
    let s = {}; try { s = JSON.parse(fs.readFileSync(ST, "utf8")); } catch {}
    s.keys = s.keys || {}; s.queueUntil = s.queueUntil || 0;
    const r = fn(s);
    fs.writeFileSync(ST + ".tmp", JSON.stringify(s)); fs.renameSync(ST + ".tmp", ST);
    return r;
  } finally { try { fs.rmdirSync(LOCK); } catch {} }
}
function anotar(tag, res, key, extra = "") {
  try { fs.appendFileSync(LOG, JSON.stringify({ t: Date.now(), pid: process.pid, tag, res, k: key ? hk(key) : null, x: String(extra).slice(0, 160) }) + "\n"); } catch {}
}

/** Reserva una clave libre (espera lo necesario). Marca su próximo uso en +61 s para todos los procesos. */
export async function acquireKey() {
  if (!KEYS.length) throw new Error("agnes_pool: no hay AGNES_KEYS");
  for (;;) {
    const r = await locked((s) => {
      const now = Date.now();
      // pausa por cola llena: como mucho QUEUE_REST desde el último rechazo (procesos viejos todavía escriben +10 s)
      const qUntil = Math.min(s.queueUntil || 0, Math.max(s.queueSetAt || 0, (s.queueUntil || 0) - 10_000) + QUEUE_REST);
      if (qUntil > now) return { wait: qUntil - now };
      if ((s.lastPost || 0) + MIN_SPACING > now) return { wait: s.lastPost + MIN_SPACING - now };
      let best = null, bestT = Infinity;
      for (const k of KEYS) { const e = s.keys[hk(k)] || {}; const nx = e.next || 0; if (nx < bestT) { bestT = nx; best = k; } }
      if (bestT > now) return { wait: bestT - now };
      s.keys[hk(best)] = { ...(s.keys[hk(best)] || {}), next: now + GAP, used: now }; s.lastPost = now;
      return { key: best };
    });
    if (r.key) return r.key;
    await sleep(Math.min(r.wait + 50 + Math.random() * 500, 15_000));
  }
}
/** Informa cómo le fue a la clave: "ok" | "rate" | "queue" | "err". */
export async function reportKey(key, res) {
  await locked((s) => {
    const now = Date.now(), e = s.keys[hk(key)] || {};
    if (res === "rate") e.next = Math.max(e.next || 0, now + RATE_REST);
    if (res === "iprate") { s.queueUntil = Math.max(s.queueUntil, now + IP_REST); e.next = Math.min(e.next || 0, now + IP_REST); }
    if (res === "queue") { s.queueSetAt = now; s.queueUntil = Math.max(s.queueUntil, now + QUEUE_REST); e.next = Math.min(e.next || 0, now + QUEUE_REST); }
    if (res === "quota") e.next = Math.max(e.next || 0, now + QUOTA_REST);
    e[res] = (e[res] || 0) + 1; s.keys[hk(key)] = e;
  });
}
const clasificar = (m) => /free users/i.test(m) ? "rate" : /used up today's video generation quota|1 request every 3 minutes/i.test(m) ? "quota" : /rate exceeds|too many|"code":429|\b429\b/i.test(m) ? "iprate" : /rate limit/i.test(m) ? "rate" :/queue|busy|capacity/i.test(m) ? "queue" : /fetch failed|timeout|ECONN|aborted|network|socket|5\d\d/i.test(m) ? "red" : "reject";

/** Envía un video. Devuelve { vid, key } o tira error si agnes lo rechaza por contenido/parámetros. */
export async function agnesSubmit(body, { tag = "", maxTries = 2000 } = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  for (let t = 0; t < maxTries; t++) {
    const key = await acquireKey();
    let j, raw = "";
    try {
      const r = await fetch(B + "/videos", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: payload, signal: AbortSignal.timeout(90_000) });
      raw = await r.text(); try { j = JSON.parse(raw); } catch { j = {}; }
      if (!r.ok && !raw) raw = "HTTP " + r.status;
    } catch (e) { raw = String(e); j = {}; }
    const vid = j.video_id || j.id;
    if (vid) { await reportKey(key, "ok"); anotar(tag, "ok", key); return { vid, key, tries: t + 1 }; }
    const c = clasificar(raw);
    anotar(tag, c, key, raw);
    if (c === "reject") throw new Error("agnes REJECT: " + raw.slice(0, 300));
    await reportKey(key, c === "red" ? "err" : c);
    if (c === "red") await sleep(5000);
  }
  throw new Error("agnes_pool: demasiados intentos " + tag);
}
/** Espera el video (consulta con la MISMA clave). Devuelve { url } o { error }. */
export async function agnesWait(vid, key, { model = "agnes-video-2.5-flash", maxMs = 60 * 60e3, every = 15_000 } = {}) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    await sleep(every);
    let g = {};
    try { g = await (await fetch(`${ROOT}/agnesapi?video_id=${encodeURIComponent(vid)}&model_name=${model}`, { headers: { Authorization: "Bearer " + key }, signal: AbortSignal.timeout(60_000) })).json(); } catch { continue; }
    if (g.url && (g.status === "completed" || !g.status)) return { url: g.url, secs: Math.round((Date.now() - t0) / 1000) };
    const raw = JSON.stringify(g);
    if (/rate limit|too many|429/i.test(raw) && !/fail/i.test(String(g.status || ""))) continue; // 429 de CONSULTA: no es el job
    if (/fail|error|cancel/i.test(g.status || "") || (g.error && !g.status)) return { error: raw.slice(0, 300) };
  }
  return { error: "timeout" };
}
export async function agnesDownload(url, out) {
  for (let t = 0; t < 6; t++) {
    try { const r = await fetch(url, { signal: AbortSignal.timeout(300_000) }); const b = Buffer.from(await r.arrayBuffer()); if (b.length > 10_000) { fs.writeFileSync(out, b); return true; } } catch {}
    await sleep(10_000);
  }
  return false;
}
/** Envía + espera + baja. Devuelve { ok, secs, error }. */
export async function agnesGenerate(body, out, { tag = "", model } = {}) {
  const b = typeof body === "string" ? JSON.parse(body) : body;
  const { vid, key } = await agnesSubmit(b, { tag });
  const w = await agnesWait(vid, key, { model: model || b.model });
  if (w.error) { anotar(tag, "fail", key, w.error); return { ok: false, error: w.error, vid }; }
  const ok = await agnesDownload(w.url, out);
  anotar(tag, ok ? "done" : "dl_fail", key, w.secs);
  return { ok, secs: w.secs, vid };
}

// CLI: node factory/lib/agnes_pool.mjs stats [minutos=60]
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) && process.argv[2] === "stats") {
  const min = Number(process.argv[3] || 60), desde = Date.now() - min * 60e3, c = {}, procs = new Set();
  try { for (const l of fs.readFileSync(LOG, "utf8").split("\n")) { if (!l) continue; const e = JSON.parse(l); if (e.t < desde) continue; c[e.res] = (c[e.res] || 0) + 1; procs.add(e.pid); } } catch {}
  let s = {}; try { s = JSON.parse(fs.readFileSync(ST, "utf8")); } catch {}
  const now = Date.now(), libres = KEYS.filter((k) => ((s.keys || {})[hk(k)]?.next || 0) <= now).length;
  console.log(`agnes_pool · últimos ${min} min · ${KEYS.length} claves (${RES.size} reservadas otra PC) · libres ahora ${libres} · procesos ${procs.size}`);
  console.log("  envíos OK:", c.ok || 0, "· terminados:", c.done || 0, "· fallidos:", c.fail || 0);
  console.log("  rechazos → límite por clave:", c.rate || 0, "· ráfaga PC (rate exceeds):", c.iprate || 0, "· cola llena (global):", c.queue || 0, "· red:", c.red || 0, "· contenido:", c.reject || 0);
  if (s.queueUntil > now) console.log("  ⏸ cola global llena, espera", Math.round((s.queueUntil - now) / 1000), "s");
}
