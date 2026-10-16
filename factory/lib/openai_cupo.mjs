// openai_cupo.mjs — TURNO y PLAN B para los Batch de imágenes de OpenAI (13-oct-2026).
//
// ⛔ Por qué existe: la cola de Batch es UNA por cuenta. El 13-oct entraron ~1.170 imágenes en 20 min
//    (10 videos del Repositor a la vez) y los batches de los demás videos quedaron 1-2 h en 0/N; uno
//    de fhoct (52 imágenes) estuvo ~2 h parado. Libre, un batch tarda 1-5 min.
//
//  esperarCupo(n)      → antes de mandar n imágenes: si en la cuenta ya hay > CUPO pedidos sin
//                        terminar (de TODAS las sesiones y las 2 PCs, se pregunta a OpenAI), espera.
//                        Tope de espera 60 min (después manda igual: nunca se traba para siempre).
//  trabado(batch)      → true si un batch lleva > PLANB_MIN minutos sin terminar ni una imagen.
//  planB(items, out)   → cancela el batch trabado y hace las imágenes que faltan con agnes-image
//                        (scripts/agnes_img.mjs, gratis, a ritmo lento para no quemar claves).
//
// Ajustes por entorno: OPENAI_BATCH_CUPO (def 250 imágenes en vuelo) · OPENAI_CUPO_MAX_MIN (def 5) ·
//                      OPENAI_PLANB_MIN (def 8) · OPENAI_RESCATE=0 desactiva el rescate.
//
// ⭐ 15-oct-2026 (pedido del creador: "cada video listo en un tope de 2 h, misma calidad"): medido en 14 h, un batch
//    libre tarda 1-7 min pero muchos quedan HORAS en 0/N, y el plan B a agnes estaba en 429/403 (743 imágenes
//    canceladas con 0 hechas). Ahora: turno máx 5 min · trabado = pasó max(8 min, 0,15 min por imagen) sin terminar ·
//    plan B = cancelar, BAJAR lo que el batch ya hizo y hacer el resto con gpt-image-2 low SINCRÓNICO
//    (openai_batch_rapido.mjs: mismas palancas, segundos por imagen, ~el doble de precio sólo en lo trabado).
//    OPENAI_PLANB=0 ya no hace falta (era para no mandar a agnes): se ignora.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "C:/Users/bauti/Downloads/video2";
const CUPO = +(process.env.OPENAI_BATCH_CUPO || 250);
const PLANB_MIN = +(process.env.OPENAI_PLANB_MIN || 8);
const CUPO_MAX_MIN = +(process.env.OPENAI_CUPO_MAX_MIN || 5);
const RESERVAS = (fs.existsSync("D:/") ? "D:/rtmp" : process.env.TEMP || "/tmp") + "/openai_cupo_reservas.jsonl";
const ABIERTOS = new Set(["validating", "in_progress", "finalizing"]);

const clave = () => {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const m = fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^OPENAI_API_KEY\s*=\s*"?([^"\r\n]+)/m);
  return m[1].trim();
};
const api = async (p, o = {}) => {
  const r = await fetch("https://api.openai.com/v1" + p, { ...o, headers: { Authorization: `Bearer ${clave()}`, ...(o.headers || {}) } });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return r.json();
};
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Imágenes pedidas y todavía sin terminar en toda la cuenta (batches abiertos de las últimas 3 h). */
export async function enVuelo() {
  const desde = Date.now() / 1000 - 3 * 3600;
  const { data } = await api("/batches?limit=100");
  return data.filter((b) => ABIERTOS.has(b.status) && b.created_at > desde)
    .reduce((s, b) => s + Math.max(0, (b.request_counts?.total || 0) - (b.request_counts?.completed || 0) - (b.request_counts?.failed || 0)), 0);
}

// reservas locales de los últimos 3 min: tapan el hueco entre "hay lugar" y que OpenAI cuente el batch nuevo
const reservado = () => {
  try {
    const t0 = Date.now() - 180e3;
    return fs.readFileSync(RESERVAS, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((r) => r.t > t0).reduce((s, r) => s + r.n, 0);
  } catch { return 0; }
};

export async function esperarCupo(n, { log = console.log } = {}) {
  await dormir(Math.random() * 15e3); // que 10 sesiones no pregunten en el mismo segundo
  const t0 = Date.now();
  for (;;) {
    let ocupado;
    try { ocupado = (await enVuelo()) + reservado(); } catch (e) { log(`  (cupo: no pude consultar OpenAI, mando igual: ${e.message})`); break; }
    if (ocupado === 0 || ocupado + n <= CUPO) break;
    const min = Math.round((Date.now() - t0) / 60e3);
    if (min >= CUPO_MAX_MIN) { log(`  ⚠ cupo: ${CUPO_MAX_MIN} min esperando turno (${ocupado} en vuelo), mando igual (si se traba, el rescate sincrónico lo termina)`); break; }
    log(`  ⏳ turno Batch: ${ocupado} imágenes en vuelo en la cuenta (cupo ${CUPO}), las ${n} mías esperan · ${min} min`);
    await dormir(60e3);
  }
  fs.appendFileSync(RESERVAS, JSON.stringify({ t: Date.now(), n, pid: process.pid }) + "\n");
}

/** b = objeto batch de OpenAI. Trabado = abierto y pasó su plazo: max(PLANB_MIN, 0,15 min por imagen), con o sin avance parcial. */
export function trabado(b) {
  if (process.env.OPENAI_RESCATE === "0" || !ABIERTOS.has(b.status) || b.status === "finalizing") return false;
  const c = b.request_counts || {};
  const plazo = Math.max(PLANB_MIN, 0.15 * (c.total || 0)) * 60;
  return Date.now() / 1000 - b.created_at > plazo;
}

/** Cancela el batch trabado, baja lo que ya hizo y genera lo que falte con gpt-image-2 low SINCRÓNICO. → cuántas quedaron hechas. */
export async function planB(batchId, items, outDir, { log = console.log } = {}) {
  try { await api(`/batches/${batchId}/cancel`, { method: "POST" }); } catch (e) { log(`  (no pude cancelar ${batchId}: ${e.message})`); }
  // lo que el batch ya terminó no se paga dos veces: esperar a que quede "cancelled" (máx 1 min) y bajarlo
  try {
    const { fetchBatch, pollBatch } = await import("./openai_batch.mjs");
    for (let t = 0; t < 6; t++) { const p = await pollBatch(batchId); if (!ABIERTOS.has(p.status) && p.status !== "cancelling") break; await dormir(10e3); }
    const f = await fetchBatch({ batchId, outDir, onLog: () => {} });
    if (f.ok) log(`  ↓ ${f.ok} imágenes que el batch ya había hecho, bajadas`);
  } catch (e) { log(`  (no pude bajar lo parcial de ${batchId}: ${e.message.slice(0, 120)})`); }
  const falta = items.filter((it) => !["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`))));
  if (!falta.length) return items.length;
  log(`  🛟 RESCATE: batch ${batchId} pasó su plazo → ${falta.length} imágenes con gpt-image-2 low sincrónico`);
  const { sincronico } = await import("./openai_batch_rapido.mjs");
  await sincronico(falta, outDir, { log });
  return items.filter((it) => ["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`)))).length;
}
