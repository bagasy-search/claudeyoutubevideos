#!/usr/bin/env node
// Parte un guion en escenas para create_video_from_studio y VALIDA que se pueda mandar.
//
// Por qué existe: el render de HeyGen es ALL-OR-NOTHING — una escena vacía, pasada de largo o con
// un tag [ ] sin cerrar tira abajo las 50 y se pierde el crédito. Contar caracteres "a ojo" no
// sirve. Esto lo hace determinístico.
//
//   node scripts/heygen_plan.mjs public/guiones/<slug>.txt --look <LOOK_ID> --voice <VOICE_ID>
//   node scripts/heygen_plan.mjs public/guiones/<slug>.txt --look L --voice V --json > plan.json
//
// Sale con código 1 si el guion NO se puede mandar. Si sale 0, el payload de --json va derecho a
// la tool sin tocar nada.

import { readFileSync } from "node:fs";

// ── Números medidos el 27-28 jul 2026 sobre renders reales. No estimaciones. ──
const MODELOS = {
  eleven_v3:              { chars: 3000, chMin: 876 },  // v3 recorta a 3000 aunque la API acepte 5000
  eleven_multilingual_v2: { chars: 5000, chMin: 953 },
};
const MAX_ESCENAS = 50;
const MAX_MIN = 30;      // tope de salida de HeyGen
const MARGEN = 0.95;     // 28:50 sobre 30:00 fue demasiado justo una vez

const args = process.argv.slice(2);
const arg = (n, d = null) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const file = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1]?.startsWith("--") !== true);
const model = arg("model", "eleven_v3");
const look = arg("look"), voice = arg("voice");
const json = args.includes("--json");

if (!file) { console.error("uso: node scripts/heygen_plan.mjs <guion.txt> --look <ID> --voice <ID> [--model eleven_v3] [--json]"); process.exit(2); }
const M = MODELOS[model]; if (!M) { console.error("modelo desconocido: " + model); process.exit(2); }

const texto = readFileSync(file, "utf8").trim();
const presupuesto = Math.floor(M.chMin * MAX_MIN * MARGEN);

// Cortamos SOLO en límites de párrafo: partir a mitad de frase le arruina la entonación a v3 y deja
// la costura en un punto donde después no se puede tapar con b-roll.
const parrafos = texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const escenas = [];
let cur = "";
for (const p of parrafos) {
  const cand = cur ? cur + "\n\n" + p : p;
  if (cand.length <= M.chars) cur = cand;
  else { if (cur) escenas.push(cur); cur = p; }
}
if (cur) escenas.push(cur);

// Un guion largo no entra en un render. Se parte en tandas = 1 crédito cada una. NUNCA se acelera
// la voz para que entre (suena apurado y el público es +60).
const tandas = [];
let t = [], len = 0;
for (const e of escenas) {
  if (t.length && (len + e.length > presupuesto || t.length >= MAX_ESCENAS)) { tandas.push(t); t = []; len = 0; }
  t.push(e); len += e.length;
}
if (t.length) tandas.push(t);

// ── Validación ──
const err = [];
if (!look) err.push("falta --look (el look de HeyGen del canal)");
if (!voice) err.push("falta --voice (la voz del canal)");
if (!escenas.length) err.push("el guion quedó vacío después de partirlo");

tandas.forEach((tan, ti) => {
  const mins = tan.reduce((a, e) => a + e.length, 0) / M.chMin;
  if (tan.length > MAX_ESCENAS) err.push(`tanda ${ti + 1}: ${tan.length} escenas (tope ${MAX_ESCENAS})`);
  if (mins > MAX_MIN) err.push(`tanda ${ti + 1}: ~${mins.toFixed(1)} min (tope ${MAX_MIN})`);
  tan.forEach((e, i) => {
    const donde = `tanda ${ti + 1}, escena ${i + 1}`;
    if (!e.trim()) err.push(`${donde}: vacía`);
    if (e.length > M.chars) err.push(`${donde}: ${e.length} chars (tope ${M.chars} en ${model}) — ese párrafo hay que partirlo a mano`);
    const ab = (e.match(/\[/g) || []).length, ce = (e.match(/\]/g) || []).length;
    if (ab !== ce) err.push(`${donde}: tags [] sin balancear (${ab} abren, ${ce} cierran)`);
    if (/\[(pausa|pause)\]/i.test(e)) err.push(`${donde}: tiene [pausa]/[pause] — enlentece la voz, sacalo`);
  });
});

const payloads = tandas.map((tan, i) => ({
  title: `${file.split(/[\\/]/).pop().replace(/\.txt$/, "")}${tandas.length > 1 ? ` (${i + 1}/${tandas.length})` : ""}`,
  aspectRatio: "16:9",
  resolution: "1080p",
  scenes: tan.map((script) => ({
    type: "avatar_video",
    input: {
      type: "avatar", avatar_id: look, voice_id: voice,
      engine: { type: "avatar_iii" },   // ⛔ PROHIBIDO avatar_iv / avatar_v. Omitirlo = usar avatar_iv.
      voice_settings: { speed: 1.0, engine_settings: { engine_type: "elevenlabs", model } },
      script,
    },
  })),
}));

if (json) {
  if (err.length) { console.error("NO SE PUEDE MANDAR:\n" + err.map((e) => " · " + e).join("\n")); process.exit(1); }
  console.log(JSON.stringify({ creditos: payloads.length, payloads }, null, 1));
  process.exit(0);
}

const chars = escenas.reduce((a, e) => a + e.length, 0);
console.log(`guion   ${chars.toLocaleString("es-AR")} chars · ${model}`);
console.log(`escenas ${escenas.length} (máx ${Math.max(...escenas.map((e) => e.length))} chars)`);
console.log(`duración ~${(chars / M.chMin).toFixed(1)} min a velocidad x1`);
console.log(`renders ${tandas.length}  →  ${tandas.length} crédito${tandas.length === 1 ? "" : "s"}`);
tandas.forEach((tan, i) => console.log(`  tanda ${i + 1}: ${tan.length} escenas · ~${(tan.reduce((a, e) => a + e.length, 0) / M.chMin).toFixed(1)} min`));
if (err.length) { console.log("\n⛔ NO SE PUEDE MANDAR:"); err.forEach((e) => console.log(" · " + e)); process.exit(1); }
console.log("\n✅ listo para mandar. Con --json sale el payload exacto para create_video_from_studio.");
