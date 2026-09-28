// scripts/agnes_img.mjs — GENERADOR COMPARTIDO de imágenes con agnes-image (todos los canales).
//
//   node scripts/agnes_img.mjs <lista.json> <outDir> [--conc 6] [--ref <png>]
//   lista = [{ name, prompt, ref?: [ruta] }]   (el mismo formato que scripts/gptimg.mjs)
//
// ⛔⛔ POR QUÉ EXISTE (19-sep-2026): la cuenta de OpenAI del creador está **DESACTIVADA**
//    (`401 account_deactivated` en /v1/files y /v1/models), así que `scripts/gptimg.mjs` — que es el
//    camino mandado para TODAS las imágenes — no puede mandar un batch. Esto NO reemplaza a
//    gpt-image: es el respaldo GRATIS mientras la cuenta esté caída.
//
// ⛔⛔ EL DIALECTO DE PROMPT DE agnes ES EL OPUESTO AL DE gpt-image, Y ES LA REGLA QUE MÁS CUESTA:
//    en agnes se describe SÓLO LO QUE SE VE, con hechos concretos (material, desgaste, de dónde entra
//    la luz, qué más hay sobre la mesa) y **CERO vocabulario de imagen** — nada de `candid photo`,
//    `taken on a smartphone`, `sharp focus`, `deep depth of field`, `no filter`, `no ai look`,
//    `cinematic`, `35mm`, `bokeh`, `8k`. Esos tokens mandan al modelo a razonar sobre un GÉNERO y
//    devuelve el cliché del género (o dibuja el celular dentro del cuadro). El sufijo de estilo de
//    gpt-image se SACA: este runner lo corta y avisa cuántos cortó.
//
// ⛔ agnes-IMAGEN ignora etnia y edad cuando no hay referencia (el de VIDEO no). Para los planos del
//    presentador va SIEMPRE `ref` + la cláusula de identidad, y se verifica con visión antes de la
//    tanda grande (medido acá: con ref, "same_person: true", 70 contra 70 años).
//
// ⛔ Toda llamada lleva timeout Y progreso (regla 3.ter): sin eso, con la clave saturada por otra
//    sesión el proceso queda vivo media hora sin imprimir una línea.
import fs from "node:fs";
import path from "node:path";

const [LIST, OUT0] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!LIST || !OUT0) { console.error("uso: node scripts/agnes_img.mjs <lista.json> <outDir> [--conc N]"); process.exit(1); }
const OUT = OUT0;
const CONC = +(process.argv[process.argv.indexOf("--conc") + 1] || 6);
fs.mkdirSync(OUT, { recursive: true });

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch { }
const KEYS = (process.env.AGNES_KEYS || env.AGNES_KEYS || env.AGNES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KEYS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(1); }
const BASE = (process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "");
const MODEL = process.env.AGNES_IMG_MODEL || "agnes-image-2.1-flash";
const SIZE = process.env.AGNES_IMG_SIZE || "1088x608";

// ⛔ el sufijo de gpt-image, palabra por palabra. Si aparece, se corta.
const RUIDO = /,?\s*(candid photo taken on a modern smartphone|candid photo on a modern smartphone|bright natural daylight|true-to-life colou?rs?|sharp focus|deep depth of field[^,.]*|the background cluttered with ordinary everyday objects that stay readable|nothing blurred out|realistic|candid everyday snapshot|no filter|no ai look|no text|no letters|no labels|no signs|cinematic|photorealistic|8k|35\s?mm|bokeh)\b/gi;

const IDENT = "Preserve the exact identity, face, white hair combed straight back, short trimmed white beard, "
  + "age and skin tone of the man in the reference photograph. He wears a navy blue work shirt with a small "
  + "oval red name patch on the chest.";

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
let cortados = 0;
const refCache = new Map();
const dataUrl = (p) => {
  if (!refCache.has(p)) {
    if (!fs.existsSync(p)) throw new Error("ref inexistente: " + p);
    const ext = path.extname(p).toLowerCase() === ".jpg" ? "jpeg" : "png";
    refCache.set(p, `data:image/${ext};base64,` + fs.readFileSync(p).toString("base64"));
  }
  return refCache.get(p);
};

const REF_GRANDE = process.argv.includes("--ref") ? process.argv[process.argv.indexOf("--ref") + 1] : null;

const prep = items.map((it) => {
  let p = String(it.prompt);
  const antes = p.length;
  p = p.replace(RUIDO, "").replace(/\s{2,}/g, " ").replace(/\s*,\s*,/g, ",").replace(/[,\s]+$/, ".").trim();
  if (p.length < antes - 20) cortados++;
  const refs = it.ref ? [].concat(it.ref) : [];
  const usarRef = REF_GRANDE && refs.length ? [REF_GRANDE] : refs;
  if (usarRef.length) p = p + " " + IDENT;
  return { name: it.name, prompt: p, refs: usarRef };
});

const pend = prep.filter((x) => {
  const f = path.join(OUT, x.name + ".png");
  return !(fs.existsSync(f) && fs.statSync(f).size > 20000);
});

console.log("═".repeat(70));
console.log(`MEDIDO: ${items.length} items · ${prep.filter((x) => x.refs.length).length} con referencia de identidad`);
console.log(`   sufijo de gpt-image recortado en ${cortados} prompts (agnes rechaza el vocabulario de imagen)`);
console.log(`   ${KEYS.length} claves · modelo ${MODEL} · ${SIZE} · concurrencia ${CONC}`);
console.log(`   a generar ${pend.length} · ya estaban ${items.length - pend.length}`);
if (!pend.length) { console.log("nada que hacer"); process.exit(0); }

let ki = 0, hechos = 0, fallidos = 0;
const t0 = Date.now();
const errores = [];

async function uno(it, intento = 0) {
  const key = KEYS[(ki++) % KEYS.length];
  const body = {
    model: MODEL, prompt: it.prompt, n: 1, size: SIZE,
    extra_body: it.refs.length
      ? { image: it.refs.map(dataUrl), response_format: "url" }
      : { response_format: "url" },
  };
  try {
    const r = await fetch(`${BASE}/images/generations`, {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(180000),
    });
    const txt = await r.text();
    if (!r.ok) throw new Error(`${r.status} ${txt.slice(0, 160)}`);
    const d = JSON.parse(txt);
    const u = d?.data?.[0]?.url;
    const b64 = d?.data?.[0]?.b64_json;
    let buf;
    if (b64) buf = Buffer.from(b64, "base64");
    else if (u) buf = Buffer.from(await (await fetch(u, { signal: AbortSignal.timeout(120000) })).arrayBuffer());
    else throw new Error("respuesta sin imagen: " + txt.slice(0, 160));
    if (buf.length < 20000) throw new Error("imagen sospechosamente chica (" + buf.length + " B)");
    fs.writeFileSync(path.join(OUT, it.name + ".png"), buf);
    hechos++;
    return true;
  } catch (e) {
    const msg = String(e.message || e);
    // 429 = el cupo es por CUENTA, no por clave: esperar y reintentar, no rotar y machacar
    if (intento < 4 && /429|rate|timeout|ETIMEDOUT|ECONNRESET|50\d/i.test(msg)) {
      await new Promise((s) => setTimeout(s, 8000 * (intento + 1)));
      return uno(it, intento + 1);
    }
    fallidos++; errores.push(`${it.name}: ${msg.slice(0, 140)}`);
    return false;
  }
}

const cola = [...pend];
await Promise.all(Array.from({ length: Math.min(CONC, cola.length) }, async () => {
  while (cola.length) {
    const it = cola.shift();
    await uno(it);
    const n = hechos + fallidos;
    if (n % 10 === 0) {
      const min = (Date.now() - t0) / 60000;
      console.log(`   ${n}/${pend.length} · ok ${hechos} · fallidos ${fallidos} · ${min.toFixed(1)} min · ${(n / min).toFixed(1)} img/min`);
    }
  }
}));

console.log("─".repeat(70));
console.log(`MEDIDO: ${hechos} generadas · ${fallidos} fallidas · ${((Date.now() - t0) / 60000).toFixed(1)} min`);
for (const e of errores.slice(0, 20)) console.log("   ⛔ " + e);
if (errores.length > 20) console.log(`   … y ${errores.length - 20} más`);
console.log("═".repeat(70));
process.exit(fallidos ? 2 : 0);
