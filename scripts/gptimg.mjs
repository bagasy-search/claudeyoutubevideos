#!/usr/bin/env node
// gptimg.mjs — TODAS las imágenes del pipeline con gpt-image-2, por Batch, con las 4 palancas puestas.
//
// Decisión del creador (16-sep-2026): gpt-image-2 para TODO, Klein fuera. Este comando es la forma de
// generarlas fuera de la fábrica (la fábrica usa el mismo módulo: factory/lib/openai_batch.mjs).
//
//   node scripts/gptimg.mjs <items.json> <outDir>            manda, espera y baja (reanudable)
//   node scripts/gptimg.mjs <items.json> <outDir> --no-wait  sólo manda; volvé a correrlo para bajar
//
// items.json = [{ "name": "m012", "prompt": "…", "ref": "public/ref_<slug>_face.png" }, …]
//   · con `ref` → /v1/images/edits  (planos del presentador)            $0,00207
//   · sin `ref` → /v1/images/generations (objetos, escenas, otra gente)  $0,00169
//   Se arman batches SEPARADOS por endpoint (la API no deja mezclarlos) y se mandan juntos.
//
// Las 4 palancas NO son opcionales, por eso no hay flags para cambiarlas:
//   quality "low" · size "1088x608" · ref = crop de cara 128x192 · Batch.
//   Ver memoria feedback_gptimage_low_batch_siempre. Saltear una es gastar de más (sin Batch = el DOBLE).
//
// ⭐ Lo que hace BUENA la imagen no está acá: está en el prompt. CONTEXTO (lo que se dice EN ESE
//   segundo, no el tema del bloque) + DETALLE (material, desgaste, luz, lo que hay alrededor, gesto y
//   emoción) + CREATIVIDAD (la escena viva, no el objeto suelto). Ver feedback_direccion_prompts_escena_viva.
import fs from "node:fs";
import path from "node:path";
import { submitBatch, pollBatch, fetchBatch } from "../factory/lib/openai_batch.mjs";

const SIZE = "1088x608", QUALITY = "low", LOTE = 150;
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const NO_WAIT = process.argv.includes("--no-wait");
const [itemsPath, outDir] = args;
if (!itemsPath || !outDir) { console.error("Uso: node scripts/gptimg.mjs <items.json> <outDir> [--no-wait]"); process.exit(1); }

const items = JSON.parse(fs.readFileSync(itemsPath, "utf8"));
if (!Array.isArray(items) || !items.length) { console.error(`${itemsPath} no trae items`); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

// ── compuertas ANTES de gastar
const problemas = [];
const nombres = new Set();
for (const it of items) {
  if (!it.name || !it.prompt) problemas.push(`item sin name/prompt: ${JSON.stringify(it).slice(0, 80)}`);
  if (nombres.has(it.name)) problemas.push(`name repetido: ${it.name}`);
  nombres.add(it.name);
}
const dimsPng = (p) => { const b = fs.readFileSync(p); return b.slice(1, 4).toString() === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; };
for (const r of new Set(items.flatMap((it) => (it.ref ? [].concat(it.ref) : [])))) {
  if (!fs.existsSync(r)) { problemas.push(`ref inexistente: ${r}`); continue; }
  const d = dimsPng(r);
  // palanca 3: 128x192 → 96 tokens de entrada. Una ref más grande cuesta 576 (medido) y NO mejora la identidad.
  if (!d || d[0] !== 128 || d[1] !== 192)
    problemas.push(`ref ${r} es ${d ? d.join("x") : "no-PNG"}, tiene que ser el crop de cara PNG 128x192:\n      ffmpeg -i <foto> -vf "crop=<w>:<h>:<x>:<y>,scale=128:192" ${r}`);
}
// prompts: la calidad sale de acá, no de las palancas (chequeos traídos de gptimg_gate.mjs de la PC de escritorio)
const PROHIBIDOS = [
  "cinematic", "35mm", "bokeh", "8k", "highly detailed", "photorealistic", "golden hour",
  "documentary", "grainy", "low saturation", "soft muted colors", "nothing polished",
  "out of focus", "blurred", "blurry", "soft focus", "shallow depth of field",
  "subject isolation", "stock photo",
];
const MIN_CHARS = 180; // un prompt corto sale genérico: "la clave de gpt es el detalle en los prompts" (creador, 16-sep)
const sucios = [], sinProf = [], cortos = [];
for (const it of items) {
  const p = (it.prompt || "").toLowerCase();
  // "nothing blurred out" es la CLÁUSULA DE PROFUNDIDAD obligatoria: se saca antes de buscar prohibidos
  const hit = PROHIBIDOS.filter((w) => p.split("nothing blurred out").join("").includes(w));
  if (hit.length) sucios.push(`${it.name} (${hit.join(", ")})`);
  // sin la cláusula el modelo pone su fondo cremoso de catálogo = "foto trucha de IA de stock"
  if (!p.includes("nothing blurred out")) sinProf.push(it.name);
  if (p.length < MIN_CHARS) cortos.push(`${it.name} (${p.length})`);
}
if (sucios.length) problemas.push(`TOKENS PROHIBIDOS en ${sucios.length} prompts: ${sucios.slice(0, 5).join(" | ")}`);
if (sinProf.length) problemas.push(`SIN la cláusula de profundidad ("nothing blurred out") en ${sinProf.length} prompts: ${sinProf.slice(0, 8).join(", ")}`);
if (cortos.length) problemas.push(`PROMPT SIN DETALLE (< ${MIN_CHARS} caracteres) en ${cortos.length}: ${cortos.slice(0, 8).join(", ")} — describí material, desgaste, luz, lo que hay alrededor, gesto y emoción`);

console.log(`compuerta: ${items.length} items medidos · ${new Set(items.flatMap((it) => (it.ref ? [].concat(it.ref) : []))).size} refs distintas · ${problemas.length} problemas`);
if (problemas.length) { console.error("⛔ no mando nada:\n  · " + problemas.join("\n  · ")); process.exit(1); }

const conRef = items.filter((i) => i.ref), sinRef = items.filter((i) => !i.ref);
console.log(`items: ${items.length} · con presentador (/edits): ${conRef.length} · sin presentador (/generations): ${sinRef.length}`);
console.log(`costo estimado con las 4 palancas: US$${(conRef.length * 0.00207 + sinRef.length * 0.00169).toFixed(3)}`);

// ── estado reanudable
const ST = path.join(outDir, "_gptimg_batches.json");
const estado = fs.existsSync(ST) ? JSON.parse(fs.readFileSync(ST, "utf8")) : { batches: [] };
const guardar = () => fs.writeFileSync(ST, JSON.stringify(estado, null, 1));
const yaHecho = (it) => ["png", "jpg"].some((e) => fs.existsSync(path.join(outDir, `${it.name}.${e}`)));
const enVuelo = new Set(estado.batches.filter((b) => !b.bajado).flatMap((b) => b.names));

// ── mandar lo que falta (sin re-mandar lo que ya está en vuelo)
for (const grupo of [conRef, sinRef]) {
  const pend = grupo.filter((it) => !yaHecho(it) && !enVuelo.has(it.name));
  for (let i = 0; i < pend.length; i += LOTE) {
    const lote = pend.slice(i, i + LOTE);
    const s = await submitBatch({ items: lote, outDir, size: SIZE, quality: QUALITY });
    if (!s.batchId) continue;
    estado.batches.push({ id: s.batchId, endpoint: s.endpoint, n: s.n, names: lote.map((x) => x.name), bajado: false });
    guardar();
    console.log(`→ batch ${s.batchId} · ${s.endpoint} · ${s.n} imágenes`);
  }
}
const pendientes = () => estado.batches.filter((b) => !b.bajado);
if (!pendientes().length) { console.log(`✔ nada pendiente: ${items.filter(yaHecho).length}/${items.length} ya están en ${outDir}`); process.exit(0); }
if (NO_WAIT) { console.log(`--no-wait → ${pendientes().length} batch(es) en vuelo. Volvé a correr el mismo comando para bajarlos.`); process.exit(0); }

// ── esperar y bajar (la latencia real es de minutos, no de 24 h: 164 imágenes ≈ 35-40 min)
let totalOk = 0, totalFail = 0;
const fallidos = [];
while (pendientes().length) {
  for (const b of pendientes()) {
    const p = await pollBatch(b.id);
    const c = p.counts || {};
    if (["failed", "expired", "cancelled"].includes(p.status)) {
      console.error(`⛔ batch ${b.id} terminó ${p.status}: ${JSON.stringify(p.errors || {}).slice(0, 300)}`);
      b.bajado = true; b.estado = p.status; guardar(); totalFail += b.n; continue;
    }
    if (p.status !== "completed") { console.log(`  … ${b.id} ${p.status} ${c.completed || 0}/${c.total || b.n}`); continue; }
    const f = await fetchBatch({ batchId: b.id, outDir, onLog: (m) => console.log(m) });
    // ⛔ un batch dice "completed" aunque fallen TODAS las filas (medido: 207 de 207): contar, no confiar
    if (f.ok === 0) console.error(`⛔ batch ${b.id} "completed" con 0 imágenes OK (${f.fail} fallidas) — NO es un éxito`);
    totalOk += f.ok; totalFail += f.fail; fallidos.push(...f.fallidos);
    b.bajado = true; b.ok = f.ok; b.fail = f.fail; guardar();
    console.log(`✓ ${b.id} · ${b.endpoint} · ok ${f.ok} · fallidas ${f.fail}`);
  }
  if (pendientes().length) await new Promise((r) => setTimeout(r, 60_000));
}

const hechas = items.filter(yaHecho).length;
console.log(`\nMEDIDO: ${hechas}/${items.length} imágenes en ${outDir} · ok esta corrida ${totalOk} · fallidas ${totalFail}`);
if (fallidos.length) {
  fs.writeFileSync(path.join(outDir, "_gptimg_fallidos.json"), JSON.stringify(fallidos, null, 1));
  console.log(`   fallidas en ${path.join(outDir, "_gptimg_fallidos.json")} — los rechazos de safety son NO deterministas: re-rollear sueltos.`);
}
process.exit(hechas === items.length ? 0 : 2);
