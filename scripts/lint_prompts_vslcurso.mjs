// Compuerta que BLOQUEA (no recuerda): ningun prompt sale sin la clausula de PROFUNDIDAD,
// y ninguno puede traer vocabulario de camara / desenfoque / grade.
// GOTCHA de la memoria: hay que SACAR la propia clausula antes de buscar "blurred",
// porque la clausula dice "nothing blurred out" y da 100% de falsos positivos.
import fs from "node:fs";

const CLAUSULA = /deep depth of field/i;
// ⛔ Hay que sacar la clausula ANTES de buscar "blurred": la propia clausula dice
// "nothing blurred out" y si no, da 100 % de falsos positivos. Dos variantes:
// la de CUARTO (b-roll) y la de OBJETO (iconos de medallon).
const CLAUSULA_TXT =
  /deep depth of field with the whole (room|object) in focus(, the background cluttered with ordinary everyday objects that stay readable)?, nothing blurred out\.?/gi;

const PROHIBIDO = [
  "out of focus", "blurred", "blurry", "soft focus", "shallow depth", "subject isolation",
  "stock photo", "bokeh", "cinematic", "dramatic lighting", "golden hour", "colour grading",
  "color grading", "vignette", "film grain", "hdr", "rim light", "35mm", "f/", "iso ",
  "falloff", "moody",
];

const archivos = process.argv.slice(2);
if (!archivos.length) { console.error("Uso: node scripts/lint_prompts_vslcurso.mjs <lista.json> [...]"); process.exit(1); }

let total = 0, sinClausula = 0, conProhibido = 0;
for (const f of archivos) {
  const list = JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
  for (const it of list) {
    total++;
    const p = it.prompt || "";
    if (!CLAUSULA.test(p)) { sinClausula++; console.log(`  SIN CLAUSULA  ${it.name}`); }
    const limpio = p.replace(CLAUSULA_TXT, " ").toLowerCase();
    const hits = PROHIBIDO.filter((w) => limpio.includes(w));
    if (hits.length) { conProhibido++; console.log(`  PROHIBIDO     ${it.name}  ->  ${hits.join(", ")}`); }
  }
}
console.log(`\nMEDIDO: ${total} prompts · ${sinClausula} sin clausula de profundidad · ${conProhibido} con vocabulario prohibido`);
if (sinClausula || conProhibido) { console.error("BLOQUEADO — arreglar antes de gastar cuota."); process.exit(1); }
console.log("OK — todos los prompts pasan.");
