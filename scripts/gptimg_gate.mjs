// gptimg_gate.mjs — COMPUERTA de costo de gpt-image-2. Correr ANTES de cada `submit`.
//
//   node scripts/gptimg_gate.mjs <lista.json> [size]        # exit 1 = NO mandes el batch
//   node scripts/gptimg_gate.mjs --self                     # control positivo (tiene que cazar 5/5)
//
// Por que existe: las 4 palancas (low + 1088x608 + crop de cara 128x192 + Batch) se multiplican,
// y la de la REFERENCIA es INVISIBLE (se cobra como tokens de ENTRADA y los runners solo loguean
// los de SALIDA). Sin compuerta, el sobrecosto no aparece en ningun log.
// Detalle y mediciones: ~/.claude/skills/video-pipeline/references/gptimage_low_batch.md
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SIZE_OK = "1088x608";
// tarifas Batch medidas 2026-09-05: img-salida $15/M · img-entrada $4/M · texto $2,50/M
const OUT_TOK = { "1088x608": 96, "1792x1008": 138, "1536x1024": 158 };
const PROHIBIDOS = [
  "cinematic", "35mm", "bokeh", "8k", "highly detailed", "photorealistic", "golden hour",
  "documentary", "grainy", "low saturation", "soft muted colors", "nothing polished",
  "out of focus", "blurred", "blurry", "soft focus", "shallow depth of field",
  "subject isolation", "stock photo",
];

const FF = process.env.FFMPEG || "ffmpeg";
function dims(f) {
  try {
    const out = execFileSync(FF.replace(/ffmpeg(\.exe)?$/i, "ffprobe$1"), [
      "-v", "error", "-select_streams", "v:0",
      "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", f,
    ], { encoding: "utf8" });
    return out.trim();
  } catch { return null; }
}

function auditar(items, size, label) {
  const fallos = [];
  const n = items.length;
  // (1) tamanio
  if (size !== SIZE_OK) {
    const extra = OUT_TOK[size] ? ((OUT_TOK[size] / OUT_TOK[SIZE_OK] - 1) * 100).toFixed(0) : "?";
    fallos.push(`TAMANIO ${size} en vez de ${SIZE_OK} (+${extra}% de salida por imagen)`);
  }
  // (2) homogeneidad: un batch no puede mezclar edits y generations
  const con = items.filter((i) => i.ref && i.ref.length).length;
  if (con > 0 && con < n) fallos.push(`MEZCLA: ${con}/${n} con ref — edits y generations no van en el mismo batch`);
  // (3) ref tiene que ser ARRAY (con string cae a texto-a-imagen SIN CARA, en silencio)
  const strRef = items.filter((i) => typeof i.ref === "string");
  if (strRef.length) fallos.push(`ref como STRING en ${strRef.length} items (${strRef[0].name}...) — tiene que ser ARRAY o genera sin la cara`);
  // (4) cada archivo de ref existe y mide EXACTAMENTE 128x192
  const refs = [...new Set(items.flatMap((i) => (Array.isArray(i.ref) ? i.ref : [])))];
  for (const r of refs) {
    const abs = fs.existsSync(r) ? r : path.join("public/img", r);
    if (!fs.existsSync(abs)) { fallos.push(`ref INEXISTENTE: ${r}`); continue; }
    const d = dims(abs);
    if (d && d !== "128x192") {
      const tok = d === "128x192" ? 96 : 576;
      fallos.push(`ref ${r} mide ${d}, no 128x192 (~${tok} tok de entrada en vez de 96)`);
    }
  }
  // (5) tokens prohibidos en los prompts
  const sucios = [];
  for (const it of items) {
    // ⛔ "nothing blurred out" es la CLAUSULA DE PROFUNDIDAD OBLIGATORIA de la formula:
    // hay que sacarla ANTES de buscar prohibidos o la compuerta marca el 100% de los prompts.
    const p = (it.prompt || "").toLowerCase().split("nothing blurred out").join("");
    const hit = PROHIBIDOS.filter((w) => p.includes(w));
    if (hit.length) sucios.push(`${it.name}: ${hit.join(", ")}`);
  }
  if (sucios.length) fallos.push(`TOKENS PROHIBIDOS en ${sucios.length} prompts -> ${sucios.slice(0, 3).join(" | ")}`);
  // el defecto OPUESTO: sin la clausula de profundidad el modelo pone fondo cremoso = cara de IA
  const sinProf = items.filter((it) => !(it.prompt || "").toLowerCase().includes("nothing blurred out"));
  if (sinProf.length) fallos.push(`SIN CLAUSULA DE PROFUNDIDAD ("nothing blurred out") en ${sinProf.length} prompts -> ${sinProf.slice(0,3).map(x=>x.name).join(", ")}`);
  // (6) presupuesto
  const ot = OUT_TOK[size] || OUT_TOK[SIZE_OK];
  const refTok = refs.length ? 96 : 0;
  // ⛔ 15/4/2,5 YA SON las tarifas de BATCH (la normal es el doble): NO dividir otra vez.
  // Verificado contra la medicion del 2026-09-05: 96 tok salida + 96 de ref = $0,00207 exacto.
  const unit = (ot * 15 + 98 * 2.5 + refTok * 4) / 1e6;
  return { fallos, n, con, refs, unit, total: unit * n, label };
}

// ---- control positivo: una compuerta que no se valida no es una compuerta ----
if (process.argv[2] === "--self") {
  const fake = [
    { name: "a", ref: ["public/__no_existe__.png"], prompt: "a cinematic shot, bokeh" },
    { name: "b", ref: "public/__no_existe__.png", prompt: "ok" },
    { name: "c", prompt: "ok" },
  ];
  const r = auditar(fake, "1536x1024", "self");
  const esperadas = ["TAMANIO", "MEZCLA", "STRING", "INEXISTENTE", "PROHIBIDOS"];
  const cazadas = esperadas.filter((e) => r.fallos.some((f) => f.includes(e)));
  console.log(`control positivo: ${cazadas.length}/${esperadas.length} fallas cazadas`);
  r.fallos.forEach((f) => console.log("   -", f));
  process.exit(cazadas.length === esperadas.length ? 0 : 1);
}

const lista = process.argv[2];
const size = process.argv[3] || SIZE_OK;
if (!lista) { console.error("uso: node scripts/gptimg_gate.mjs <lista.json> [size]"); process.exit(1); }

const items = JSON.parse(fs.readFileSync(lista, "utf8").replace(/^﻿/, ""));
const r = auditar(items, size, lista);

// ⛔ una compuerta que puede dar OK sin haber mirado tiene que imprimir CUANTO midio
console.log(`gptimg_gate · ${r.n} items medidos · ${r.con} con referencia · ${r.refs.length} archivos de ref distintos`);
console.log(`   size ${size} · unitario US$${r.unit.toFixed(5)} · TOTAL ESTIMADO US$${r.total.toFixed(3)}`);
if (r.n === 0) { console.error("   ⛔ 0 items: la lista esta vacia o no se parseo"); process.exit(1); }

if (r.fallos.length) {
  console.error(`\n⛔ ${r.fallos.length} FALLAS — NO mandes el batch:`);
  r.fallos.forEach((f) => console.error("   -", f));
  const opt = auditar(items, SIZE_OK, lista);
  console.error(`\n   con las 4 palancas seria US$${(opt.unit * r.n).toFixed(3)} (ahorro US$${(r.total - opt.unit * r.n).toFixed(3)})`);
  process.exit(1);
}
console.log("   ✅ las 4 palancas puestas: low + 1088x608 + crop de cara 128x192 + Batch");
