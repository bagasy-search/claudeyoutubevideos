// moments_cmeciclo.mjs — corta el guion de `cmeciclo` en MOMENTOS frase a frase (montaje VLOG CRUDO).
//
// ⛔ Regla del canal (feedback_edicion_vlog_casero_claudio): un plano por FRASE, no por bloque.
//    Cada momento se lleva SU propio asset, escrito con los sustantivos de ESA frase.
//    Acá sólo se corta el texto y se le pone la sección: los prompts los escribe el DIRECTOR.
//
// Salida: _v3/cmeciclo_moments.json  → [{id, sec, secName, text, anchor}]
//   `anchor` = las primeras ~8 palabras del momento, que es lo que después busca la
//   alineación global contra el ASR (no se busca frase por frase: eso ancla el 27%).
import fs from "node:fs";

const SLUG = "cmeciclo";
const SRC = `guiones/${SLUG}.txt`;
const OUT = `_v3/${SLUG}_moments.json`;
const TARGET = 115;   // caracteres por momento ≈ 7 s a 16,3 c/s (mediana del vlog del canal)
const MAXLEN = 190;

// ── Pasada 0 del DIRECTOR: el mapa. Cada sección arranca en la frase que la nombra. ──
const SECCIONES = [
  ["S01_HOOK",       "Hace unas semanas subí un video",            "enganchar leyendo la objeción real de la audiencia"],
  ["S02_TRATO",      "Y hagamos el trato de siempre",              "escudo de honestidad: qué es y qué NO es"],
  ["S03_MESA",       "Primero pongamos las dos arriba de la mesa", "las dos baterías lado a lado: specs, peso, precio"],
  ["S04_PLACAS",     "Te lo explico con la única imagen",          "MECANISMO: placa fina vs placa gruesa, el sulfato"],
  ["S05_PICO",       "Antes de enchufar nada",                     "medir el pico de arranque del refrigerador"],
  ["S06_METODO",     "Ahora la prueba de verdad",                  "el método: duty cycle, condiciones, corte en 11,8 V"],
  ["S07_PRUEBA1",    "Cronómetro. Arranco con la de mi auto",      "prueba 1: la del auto, 3 h 08"],
  ["S08_PRUEBA2",    "Recargué todo, esperé un día",               "prueba 2: ciclo profundo, 7 h 40"],
  ["S09_PEUKERT",    "Esta es la parte que quiero que te lleves",  "MECANISMO: el amperio hora de la etiqueta miente"],
  ["S10_CICLOS",     "Y todavía falta lo más caro",                "los 5 ciclos: 11% contra 1% de desgaste"],
  ["S11_CUENTA",     "Ahora hagamos la cuenta que decide",         "costo por apagón: 10 veces más barata"],
  ["S12_APAGONES",   "no te voy a decir que compres una",          "la pregunta que decide: cuántos apagones por año"],
  ["S13_MOSTRADOR",  "Y si decidiste que vas a comprar una",       "la trampa del mostrador: marina, gel, AGM"],
  ["S14_REGLAS",     "Ahora déjame darte las cuatro cosas",        "las 4 reglas: arranque, fusible, hidrógeno, cable"],
  ["S15_CTA",        "Y sobre eso, ya que hablamos de medir",      "CTA al dolor: la pinza, y la guía como atajo"],
  ["S16_VEREDICTO",  "Y ahora el veredicto",                       "veredicto por caso + gracias al comentario + próximo"],
];

const raw = fs.readFileSync(SRC, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
const parrafos = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// ── cortar cada párrafo en oraciones, y las oraciones largas en cláusulas ──────────
const oraciones = [];
for (const p of parrafos) {
  for (const o of p.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []) {
    const t = o.trim();
    if (t) oraciones.push(t);
  }
}

// ── agrupar/partir hasta TARGET ───────────────────────────────────────────────────
const partirLargo = (t) => {
  if (t.length <= MAXLEN) return [t];
  // partir por comas/dos puntos, nunca en medio de una palabra
  const trozos = [];
  let acc = "";
  for (const parte of t.split(/(?<=[,;:])\s+/)) {
    if (acc && (acc + " " + parte).length > TARGET * 1.35) { trozos.push(acc.trim()); acc = parte; }
    else acc = acc ? acc + " " + parte : parte;
  }
  if (acc.trim()) trozos.push(acc.trim());
  return trozos;
};

const piezas = [];
for (const o of oraciones) piezas.push(...partirLargo(o));

const momentos = [];
let buf = "";
const empujar = () => { if (buf.trim()) { momentos.push(buf.trim()); buf = ""; } };
for (const pz of piezas) {
  if (!buf) { buf = pz; continue; }
  if ((buf + " " + pz).length > TARGET * 1.25) { empujar(); buf = pz; }
  else buf = buf + " " + pz;
}
empujar();

// ── asignar sección: arranca en el momento que contiene la frase de arranque ───────
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
let sec = 0;
const arranques = SECCIONES.map((s) => norm(s[1]));
const out = momentos.map((text, i) => {
  for (let k = sec + 1; k < SECCIONES.length; k += 1) {
    if (norm(text).includes(arranques[k])) { sec = k; break; }
  }
  const palabras = text.split(/\s+/);
  return {
    id: `m${String(i + 1).padStart(3, "0")}`,
    sec: SECCIONES[sec][0],
    secName: SECCIONES[sec][2],
    text,
    anchor: palabras.slice(0, Math.min(8, palabras.length)).join(" "),
    chars: text.length,
  };
});

fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ slug: SLUG, secciones: SECCIONES.map(([id, , obj]) => ({ id, objetivo: obj })), moments: out }, null, 1));

const porSec = {};
for (const m of out) porSec[m.sec] = (porSec[m.sec] || 0) + 1;
const lens = out.map((m) => m.chars).sort((a, b) => a - b);
console.log(`momentos: ${out.length} · chars mediana ${lens[Math.floor(lens.length / 2)]} · p90 ${lens[Math.floor(lens.length * 0.9)]} · max ${lens.at(-1)}`);
console.log(`seg estimados (16,3 c/s): mediana ${(lens[Math.floor(lens.length / 2)] / 16.3).toFixed(1)}s`);
for (const [id] of SECCIONES) console.log(`  ${id.padEnd(14)} ${String(porSec[id] || 0).padStart(3)} momentos${porSec[id] ? "" : "   ⛔ SECCION VACIA"}`);
console.log(`→ ${OUT}`);
