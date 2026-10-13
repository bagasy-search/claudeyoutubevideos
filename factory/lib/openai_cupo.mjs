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
// Ajustes por entorno: OPENAI_BATCH_CUPO (def 250 imágenes en vuelo) · OPENAI_PLANB_MIN (def 20) ·
//                      OPENAI_PLANB=0 desactiva el plan B · AGNES_PLANB_CONC (def 3).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = "C:/Users/bauti/Downloads/video2";
const CUPO = +(process.env.OPENAI_BATCH_CUPO || 250);
const PLANB_MIN = +(process.env.OPENAI_PLANB_MIN || 20);
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
    if (min >= 60) { log(`  ⚠ cupo: 60 min esperando turno (${ocupado} en vuelo), mando igual`); break; }
    log(`  ⏳ turno Batch: ${ocupado} imágenes en vuelo en la cuenta (cupo ${CUPO}), las ${n} mías esperan · ${min} min`);
    await dormir(60e3);
  }
  fs.appendFileSync(RESERVAS, JSON.stringify({ t: Date.now(), n, pid: process.pid }) + "\n");
}

/** b = objeto batch de OpenAI. */
export function trabado(b) {
  if (process.env.OPENAI_PLANB === "0" || !ABIERTOS.has(b.status) || b.status === "finalizing") return false;
  const c = b.request_counts || {};
  return (c.completed || 0) === 0 && Date.now() / 1000 - b.created_at > PLANB_MIN * 60;
}

/** Cancela el batch trabado y genera items (los que falten en outDir) con agnes-image. → cuántas hizo. */
export async function planB(batchId, items, outDir, { log = console.log } = {}) {
  try { await api(`/batches/${batchId}/cancel`, { method: "POST" }); } catch (e) { log(`  (no pude cancelar ${batchId}: ${e.message})`); }
  const falta = items.filter((it) => !["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`))));
  if (!falta.length) return 0;
  log(`  🛟 PLAN B: batch ${batchId} lleva >${PLANB_MIN} min en 0 → ${falta.length} imágenes con agnes-image (gratis, ritmo lento)`);
  const lista = path.join(outDir, `_planB_${batchId.slice(-8)}.json`);
  fs.writeFileSync(lista, JSON.stringify(falta.map(({ name, prompt, ref }) => (ref ? { name, prompt, ref: [].concat(ref) } : { name, prompt })), null, 1));
  spawnSync(process.execPath, [path.join(ROOT, "scripts", "agnes_img.mjs"), lista, outDir, "--conc", String(process.env.AGNES_PLANB_CONC || 3)],
    { cwd: ROOT, stdio: "inherit", env: { ...process.env, AGNES_IMG_MODEL: process.env.AGNES_IMG_MODEL || "agnes-image-2.5-flash" } });
  return falta.filter((it) => ["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`)))).length;
}
