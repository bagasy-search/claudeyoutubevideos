// agnes_img_gate.mjs — COMPUERTA de visión GRATIS para las imágenes generadas (agnes-3.0-flash).
//
//   node scripts/agnes_img_gate.mjs <lista.json> <dirImgs> [--out gate.json] [--conc 8] [--model agnes-3.0-flash]
//   lista = [{ name, prompt }]  (la misma de agnes_img.mjs / gptimg.mjs: el juez necesita el PROMPT para saber
//   qué se pidió). Escribe <out> con { name: { ok, fallas: [..], motivo } } y sale con código 1 si hay rechazos.
//
// Por qué: agnes-image (gratis) a veces pone el cuerpo ADENTRO de un objeto (Claudio saliendo del motor),
// mete gente que nadie pidió, se olvida de la persona pedida o le pega la cara del presentador a otro. Una
// foto regenerada cuesta $0 y ~20 s, así que el juez es ESTRICTO: ante la duda rechaza (un falso rechazo
// cuesta una regeneración; un defecto que pasa termina en el video).
//
// ⛔ Con CLIPS el juez de visión no sirvió (agnes_qc.mjs, 15-sep): eso es otra cosa — acá son fotos quietas,
//    preguntas cerradas una por una, y el prompt original como contrato de qué tiene que haber.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [LIST, DIR] = args.filter((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));
if (!LIST || !DIR) { console.error("uso: node scripts/agnes_img_gate.mjs <lista.json> <dirImgs> [--out gate.json] [--conc 8] [--model agnes-3.0-flash]"); process.exit(2); }
const OUT = opt("--out", path.join(DIR, "_gate.json"));
const CONC = Number(opt("--conc", 8));
const MODEL = opt("--model", process.env.GATE_MODEL || "agnes-3.0-flash");

const env = {};
try { for (const l of fs.readFileSync(".env", "utf8").split(/\r?\n/)) { const m = l.match(/^([A-Z_0-9]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch { }
const KEYS = (process.env.AGNES_KEYS || env.AGNES_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!KEYS.length) { console.error("faltan AGNES_KEYS en .env"); process.exit(2); }
const API = (process.env.AGNES_BASE_URL || env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1").replace(/\/$/, "") + "/chat/completions";

const CHECKS = {
  cuerpo_imposible: "A person's body passes through, merges with, is fused into, or comes out of a solid object (an engine bay, a car front or grille, a wall, a table, a counter, furniture) in a way that is physically impossible. A person standing IN FRONT of or BESIDE an object is fine; a torso that sits where the object's inside is, is NOT.",
  piernas: "Follow each person's body down from the shoulders: where are the hips, legs and feet? A body must continue naturally to the floor, a chair or a ladder, or be cut by the EDGE of the picture. Defect if the body is cut or swallowed by an OBJECT instead (the torso ends inside a car front, an engine bay, a grille, a bumper, a counter or a table, with no legs where they should be), or the person seems to grow out of that object.",
  anatomia: "A visible person has a deformed body: extra or missing arms or legs, a hand with fused or extra fingers, a twisted neck, a melted or doubled face, limbs at impossible angles.",
  gente_de_mas: "There is a person, or a part of a person (a hand, an arm, a torso, a head), that the description does NOT ask for. If the description asks for no people, any person or body part counts.",
  falta_lo_pedido: "A PERSON or ANIMAL the description asks for is missing or hidden so that it cannot be recognised (a dog that is the subject shows only its paws under a counter) (for example 'talks with a neighbour' but there is no neighbour), or the ONE main object of the action is missing or replaced (the description says he holds an oil dipstick and he holds a cable). Small background props (a bowl on the floor, a jar on a shelf, one food among several) do NOT count.",
  logica_fisica: "The scene is physically illogical: a person described as sitting has nothing under them, or the chair they should sit on stands empty somewhere else; a person floats; a ladder or object hangs in the air without support; furniture placed where it makes no sense for what the person is doing.",
  persona_duplicada: "Two different people in the picture have the same face, as if the same man was copied twice.",
  objeto_deforme: "An object is melted, mangled, nonsensical or impossible (an object fused with another, a shapeless lump that is not anything real). Blurry or unreadable text is NOT a defect.",
  sombra_fantasma: "A shadow, reflection or silhouette that does not belong to anyone or anything in the picture (for example the shadow of a person on a wall where no such person stands, or a reflection showing someone who is not there).",
};
// Identidad: si el item trae `ref` (cara del presentador), una llamada aparte compara cara vs foto (agnes-3.0
// acertó 4/4 en identidad el 23-sep). Medido 9-oct: sin esto pasaban fotos con un Claudio más joven / otra cara.
const QID = `The FIRST image is the reference face of the main man. Look at the SECOND image: find the man who plays that role (the main man, not other people).
Is he the same person as the reference: same face shape, nose, eyes, eyebrows, hairline and hair type, beard pattern, and about the same age?
Reply ONLY with JSON: {"misma_persona": <0-10>, "motivo": "<one short sentence>"}`;
const ID_MIN = Number(process.env.GATE_ID_MIN || 7);
const Q = (prompt) => `You are a strict quality inspector for AI-generated photos that must look like real footage.
The photo was generated from this description:
"""${prompt.slice(0, 3500)}"""

Inspect the photo carefully, region by region, and answer each check with true (defect present) or false.
${Object.entries(CHECKS).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

First count the people (and parts of people) you see and compare with the description. Then answer.
Reply ONLY with JSON: {"personas_vistas": <number>, ${Object.keys(CHECKS).map((k) => `"${k}": true|false`).join(", ")}, "motivo": "<one short sentence about the worst problem, or empty>"}`;

const uri = (f) => `data:image/${/\.jpe?g$/i.test(f) ? "jpeg" : "png"};base64,` + fs.readFileSync(f).toString("base64");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ki = 0;

// --foco: UNA llamada por chequeo (el modelo mira una sola cosa por vez). Más llamadas, todas gratis.
const FOCO = args.includes("--foco");
const QF = (prompt, k) => `You are a strict quality inspector for AI-generated photos that must look like real footage.
The photo was generated from this description:
"""${prompt.slice(0, 3500)}"""

Look ONLY for this defect, inspecting the photo region by region (edges and background included):
${k}: ${CHECKS[k]}
Reply ONLY with JSON: {"defecto": true|false, "motivo": "<one short sentence>"}`;

async function pedir(img, texto, antes = []) {
  for (let intento = 0; intento < 6; intento++) {
    const key = KEYS[(ki++) % KEYS.length];
    try {
      const r = await fetch(API, {
        method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({ model: MODEL, temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: texto }, ...antes.map((f) => ({ type: "image_url", image_url: { url: uri(f) } })), { type: "image_url", image_url: { url: uri(img) } }] }] }),
      });
      const txt = await r.text();
      if (!r.ok) throw new Error(`${r.status} ${txt.slice(0, 120)}`);
      const m = (JSON.parse(txt).choices?.[0]?.message?.content || "").match(/\{[\s\S]*\}/);
      if (!m) throw new Error("sin JSON");
      return JSON.parse(m[0]);
    } catch (e) {
      if (intento === 5) return { _error: String(e.message).slice(0, 140) };
      await sleep(3000 * (intento + 1));
    }
  }
}
const si = (v) => v === true || v === "true";

async function juzgarBase(img, prompt) {
  if (FOCO) {
    const rs = await Promise.all(Object.keys(CHECKS).map(async (k) => [k, await pedir(img, QF(prompt, k))]));
    const err = rs.find(([, j]) => j._error);
    if (err) return { ok: false, fallas: ["sin_respuesta"], motivo: err[1]._error };
    const malas = rs.filter(([, j]) => si(j.defecto));
    return { ok: !malas.length, fallas: malas.map(([k]) => k), motivo: malas.map(([, j]) => j.motivo).join(" | ") };
  }
  const j = await pedir(img, Q(prompt));
  if (j._error) return { ok: false, fallas: ["sin_respuesta"], motivo: j._error };
  const fallas = Object.keys(CHECKS).filter((k) => si(j[k]));
  return { ok: fallas.length === 0, fallas, personas: j.personas_vistas, motivo: j.motivo || "" };
}

async function juzgar(img, prompt, ref) {
  const refs = [].concat(ref || []).filter((f) => fs.existsSync(f));
  const [base, id] = await Promise.all([juzgarBase(img, prompt), refs.length ? pedir(img, QID, [refs[0]]) : null]);
  if (!id) return base;
  if (id._error) return { ok: false, fallas: [...base.fallas, "sin_respuesta"], motivo: base.motivo + " | id: " + id._error, id: null };
  const n = Number(id.misma_persona);
  if (!(n >= ID_MIN)) return { ...base, ok: false, fallas: [...base.fallas, "identidad"], motivo: [base.motivo, `identidad ${n}/10: ${id.motivo || ""}`].filter(Boolean).join(" | "), id: n };
  return { ...base, id: n };
}

const items = JSON.parse(fs.readFileSync(LIST, "utf8").replace(/^﻿/, ""));
const imgOf = (n) => [".png", ".jpg", ".jpeg"].map((e) => path.join(DIR, n + e)).find((f) => fs.existsSync(f));
const cola = items.filter((it) => imgOf(it.name));
const res = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(CONC, cola.length) }, async () => {
  while (cola.length) {
    const it = cola.shift();
    res[it.name] = await juzgar(imgOf(it.name), String(it.prompt), it.ref);
    const r = res[it.name];
    console.log(`${r.ok ? "✓" : "✗"} ${it.name}${r.ok ? "" : "  [" + r.fallas.join(",") + "] " + r.motivo}`);
  }
}));
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
const malas = Object.entries(res).filter(([, r]) => !r.ok).length;
console.log(`MEDIDO: ${Object.keys(res).length} juzgadas · ${malas} rechazadas · ${((Date.now() - t0) / 1000).toFixed(0)} s · ${MODEL} → ${OUT}`);
process.exit(malas ? 1 : 0);
