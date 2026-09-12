#!/usr/bin/env node
// Corazón del A-roll por TEMPLATE de HeyGen (v3 + movimiento + 1 crédito).
// Reemplaza a create_video_from_studio (que NO respeta v3) por generate_from_template
// (que usa la voz V3 horneada en el template). El video multi-escena = 1 crédito.
//
// Parte el guion en chunks de ≤MAX_CHARS (default 2900; v3 trunca la ESCENA en ~3000)
// y arma las variables escena_1..escena_K listas para generate_from_template.
//
// uso: node scripts/heygen_template_plan.mjs <guion.txt> [--max 2900] [--scenes 10] [--json]
//   --scenes = cuántas escenas TIENE el template (tope duro; si el guion no entra, avisa).
//
// El AGENTE después: get_template(template_id) para leer los scene_ids reales, toma los
// primeros K, y llama generate_from_template({templateId, variables, sceneIds}).

import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const arg = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const json = args.includes("--json");
const MAX = Math.max(500, Math.min(4900, Number(arg("max", 2900)))); // <3000 real de v3, <5000 de la API
const SCENE_CAP = Math.max(1, Number(arg("scenes", 10)));            // escenas disponibles en el template
// ── FRENO DURO DE CRÉDITOS ──────────────────────────────────────────────────
// HeyGen cobra el avatar por DURACIÓN (~3-4 créditos/min; ~1 crédito cada ~17 s,
// medido 5 ago 2026). Este gate BLOQUEA generar un A-roll largo sin aprobación
// explícita, para no quemar 60-70 créditos de un saque. Se aprueba con
// `--approve-long` o `HEYGEN_APPROVE_LONG=1`. Tope en minutos: `--max-min` o HEYGEN_MAX_MIN (def 5).
const MAX_MIN = Math.max(0, Number(arg("max-min", process.env.HEYGEN_MAX_MIN || 5)));
const APPROVE_LONG = args.includes("--approve-long") || process.env.HEYGEN_APPROVE_LONG === "1";
const CH_PER_MIN = 876;   // v3 habla ~876 ch/min (ver reference_heygen_mcp_avatar)
const SEC_PER_CREDIT = 17; // ~1 crédito cada ~17 s (medido: 68 s = 4 cr, 34 s = 2 cr)

if (!file) { console.error("uso: node scripts/heygen_template_plan.mjs <guion.txt> [--max 2900] [--scenes 10] [--json]"); process.exit(2); }

let text = readFileSync(file, "utf8").replace(/\r\n/g, "\n").trim();
if (!text) { console.error("guion vacío"); process.exit(2); }

// Partir SIEMPRE en límites de párrafo/oración (nunca a mitad de frase: le arruina la entonación
// a v3 y corta un tag). Empaqueta párrafos hasta acercarse a MAX sin pasarse.
const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

// si un párrafo solo ya supera MAX, se subdivide por oraciones
const splitLong = (p) => {
  if (p.length <= MAX) return [p];
  const sents = p.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) || [p];
  const out = []; let cur = "";
  for (const s of sents) {
    if ((cur + s).length > MAX && cur) { out.push(cur.trim()); cur = ""; }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

const units = paras.flatMap(splitLong);
const chunks = [];
let cur = "";
for (const u of units) {
  const cand = cur ? cur + "\n\n" + u : u;
  if (cand.length > MAX && cur) { chunks.push(cur); cur = u; }
  else cur = cand;
}
if (cur.trim()) chunks.push(cur.trim());

const overflow = chunks.length > SCENE_CAP;
const used = overflow ? chunks.slice(0, SCENE_CAP) : chunks;

// Estimación de duración/créditos del A-roll a partir de los chars usados.
const est_sec = Math.round((used.reduce((n, c) => n + c.length, 0) / CH_PER_MIN) * 60);
const est_min = +(est_sec / 60).toFixed(1);
const est_credits = Math.max(1, Math.ceil(est_sec / SEC_PER_CREDIT));

// FRENO DURO: si el A-roll supera MAX_MIN y no hay aprobación, NO devolver las
// `variables` (el agente las necesita para llamar a HeyGen) y salir con código 4.
if (MAX_MIN > 0 && est_min > MAX_MIN && !APPROVE_LONG) {
  const blocked = {
    blocked: true,
    reason: "avatar A-roll too long to generate without approval",
    est_min, est_sec, est_credits, max_min: MAX_MIN, chars_total: text.length,
    hint: `Este A-roll dura ~${est_min} min y costaría ~${est_credits} créditos de HeyGen (~3-4/min). El tope sin aprobación es ${MAX_MIN} min. Recortá el guion, o si el creador aprueba el gasto, re-corré con --approve-long (o HEYGEN_APPROVE_LONG=1). NUNCA generes un avatar largo sin aprobación explícita.`,
  };
  if (json) console.log(JSON.stringify(blocked, null, 1));
  else console.error(`⛔ BLOQUEADO: A-roll ~${est_min} min ≈ ~${est_credits} créditos HeyGen (tope ${MAX_MIN} min). Recortá el guion o pasá --approve-long con aprobación del creador.`);
  process.exit(4);
}

const variables = {};
used.forEach((c, i) => { variables[`escena_${i + 1}`] = { type: "text", content: c }; });

const report = {
  chars_total: text.length,
  scenes_needed: chunks.length,
  scene_cap: SCENE_CAP,
  overflow,                          // true = el template necesita MÁS escenas
  scenes_used: used.length,
  max_chars_scene: MAX,
  est_sec, est_min, est_credits,     // duración/costo estimado del A-roll (HeyGen cobra por duración)
  max_min: MAX_MIN, approved_long: APPROVE_LONG,
  variable_names: Object.keys(variables), // el agente mapea sceneIds = primeros K scene_ids del template
  chunk_lengths: used.map((c) => c.length),
  variables,
};

if (json) { console.log(JSON.stringify(report, null, 1)); process.exit(overflow ? 3 : 0); }

console.log(`guion: ${text.length} chars → ${chunks.length} escenas de ≤${MAX}`);
console.log(`A-roll estimado: ~${est_min} min ≈ ~${est_credits} créditos HeyGen (tope ${MAX_MIN} min${APPROVE_LONG ? ", APROBADO --approve-long" : ""})`);
console.log(`template: ${SCENE_CAP} escenas · usa ${used.length}` + (overflow ? `  ⛔ FALTAN ${chunks.length - SCENE_CAP} escenas en el template` : "  ✓ entra"));
report.chunk_lengths.forEach((n, i) => console.log(`  escena_${i + 1}: ${n} chars`));
process.exit(overflow ? 3 : 0);
