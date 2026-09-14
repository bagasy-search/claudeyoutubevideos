// gen_fcspellizco_moments.mjs — parte el GUION en momentos y (si ya existe el mapa) los ANCLA al ms.
// Clon de gen_fcstaza9_moments.mjs con el mapa de secciones de ESTE guion.
//   node gen_fcspellizco_moments.mjs      # pre-audio: momentos SIN ms (para el spec de imágenes)
//   node gen_fcspellizco_moments.mjs      # con _v3/fcspellizco_wordms.json presente: + ms real
// El ms sale de la alineación GLOBAL guion↔ASR del máster. ⛔ Nunca buscar frase por frase.
import fs from "node:fs";

const SLUG = "fcspellizco";
const OBJETIVO = 88, MIN = 48, MAX = 152;

const raw = fs.readFileSync(`guion_${SLUG}.txt`, "utf8").replace(/^﻿/, "").replace(/\r/g, "");
const parrafos = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

const ABRE = [
  ["Pellízcate el cuello. Ahorita", "HOOK_PELLIZCO"],
  ["A veces te está diciendo una cosa que ya no", "HOOK_TRES_MENSAJES"],
  ["Entonces hoy te voy a enseñar a leerlo", "PROMESA"],
  ["Pero déjame presentarme rapidito", "INTRO"],
  ["Ahora. Te tengo que decir dos cosas antes", "DOS_COSAS"],
  ["Y te pido una sola cosa, una nada más", "RETENCION"],
  ["Te voy a contar de una señora", "CASO_REBECA"],
  ["Y te lo voy a explicar, pero déjame tantito regresarme", "HISTORIA_COLERA"],
  ["Pero ahora piensa en un cuello de setenta años.", "PRUEBA_MIENTE"],
  ["Y ese resorte, eso que se gasta, tiene nombre.", "ELASTINA_LIGAS"],
  ["Bueno. Tu piel tiene ligas.", "LIGAS_PIEL"],
  ["Y aquí viene la parte que a mí, cuando la estudié", "SETENTA_ANOS"],
  ["Y ahorita seguro estás pensando", "LA_BUENA"],
  ["Cuando yo hice mi servicio social", "ANSELMO"],
  ["Y lo que hay debajo de esa piel, cuando la ven", "ELASTOSIS"],
  ["Y ahora sí, fíjate por qué te conté lo de don Anselmo.", "TU_CUELLO_SOL"],
  ["Y aquí va un detalle que me encanta", "LADO_CHOFER"],
  ["Bueno. Entonces ya tenemos al primer ladrón", "POR_QUE_CUELLO"],
  ["Ahora déjame hablarte del segundo ladrón.", "CIGARRO"],
  ["Y un tercer ladrón que te lo menciono", "AZUCAR"],
  ["Y ahora sí, regresemos con doña Rebeca.", "REBECA_TIANGUIS"],
  ["Vamos a hacerla juntos.", "PRUEBA_COMO"],
  ["Lugar número uno: el lado del cuello.", "TRES_LUGARES"],
  ["Bueno. Ya hiciste los tres.", "GRUPO1"],
  ["Grupo dos.", "GRUPO2"],
  ["Y grupo tres.", "GRUPO3"],
  ["Ahora. Espérate. Antes de seguir, tengo que decirte algo de los tres grupos", "LIMITE_LIQUIDOS"],
  ["Y ahora sí, déjame contarte cómo terminó lo de doña Rebeca.", "REBECA_FINAL"],
  ["Lo primero. Y si nada más te quedas", "CUELLO_EXISTE"],
  ["Y aparte del bloqueador, la sombra.", "SOMBRA"],
  ["Lo segundo. Si fumas, ya te lo dije.", "RETINOIDES"],
  ["Lo cuarto. Humectar.", "HUMECTAR"],
  ["Y ahorita seguro me vas a preguntar por los ejercicios.", "EJERCICIOS"],
  ["Y lo que no. Las pastillas de elastina.", "NO_ELASTINA"],
  ["Y ahora sí. Llegó el momento. El error.", "EL_ERROR"],
  ["El limón tiene adentro unas sustancias", "FUROCUMARINAS"],
  ["Entonces, fíjate la trampa.", "TRAMPA"],
  ["Y te voy a contar cómo lo supe yo", "CHAYO"],
  ["Así que, de corazón: el limón, en la comida.", "LIMON_COMIDA"],
  ["Y ya te lo prometí. La lista.", "SENALES"],
  ["Y cinco. La que te dije que la gente se aguanta meses.", "SENAL5"],
  ["Bueno, queridos amigos. Vamos cerrando.", "RESUMEN"],
  ["Y ya que estamos aquí, te lo digo una sola vez", "CTA"],
  ["Y te pido dos cosas.", "CIERRE"],
];
const secPorParrafo = [];
{
  let cur = ABRE[0][1], k = 0;
  for (const p of parrafos) {
    while (k < ABRE.length && p.startsWith(ABRE[k][0])) { cur = ABRE[k][1]; k++; }
    secPorParrafo.push(cur);
  }
  if (k < ABRE.length) { console.log("⛔ no encontré el arranque de:", ABRE.slice(k).map((a) => a[1])); process.exit(1); }
}

const frasesDe = (p) => p.match(/[^.!?…]+[.!?…]*\s*/g)?.map((s) => s.trim()).filter(Boolean) ?? [p];
const partirLarga = (f) => {
  if (f.length <= MAX) return [f];
  const out = []; let acc = "";
  for (const t of f.split(/(?<=[,;:])\s+/)) {
    if (!acc) { acc = t; continue; }
    if ((acc + " " + t).length <= MAX) acc += " " + t; else { out.push(acc); acc = t; }
  }
  if (acc) out.push(acc);
  const fin = [];
  for (const t of out) {
    if (t.length <= MAX) { fin.push(t); continue; }
    let a = "";
    for (const x of t.split(/\s+/)) { if (a && (a + " " + x).length > MAX) { fin.push(a); a = x; } else a = a ? a + " " + x : x; }
    if (a) fin.push(a);
  }
  return fin;
};

const momentos = [];
parrafos.forEach((p, ip) => {
  const sec = secPorParrafo[ip];
  const piezas = frasesDe(p).flatMap(partirLarga);
  let buf = "";
  const empujar = () => { if (buf) { momentos.push({ sec, ip, txt: buf }); buf = ""; } };
  for (const f of piezas) {
    if (!buf) buf = f;
    else if ((buf + " " + f).length <= OBJETIVO + 26) buf += " " + f;
    else { empujar(); buf = f; }
    if (buf.length >= OBJETIVO) empujar();
  }
  empujar();
});

for (let pasada = 0; pasada < 5; pasada++) {
  let toco = false;
  for (let i = 0; i < momentos.length; i++) {
    if (momentos[i].txt.length >= MIN) continue;
    const ant = momentos[i - 1], sig = momentos[i + 1];
    const solo = momentos.filter((x) => x.ip === momentos[i].ip).length === 1;
    const cabeAnt = ant && (ant.ip === momentos[i].ip || solo) && (ant.txt + " " + momentos[i].txt).length <= MAX;
    const cabeSig = sig && (sig.ip === momentos[i].ip || solo) && (momentos[i].txt + " " + sig.txt).length <= MAX;
    let destino = null;
    if (cabeAnt && cabeSig) destino = ant.txt.length <= sig.txt.length ? "ant" : "sig";
    else if (cabeAnt) destino = "ant"; else if (cabeSig) destino = "sig";
    if (!destino) continue;
    if (destino === "ant") ant.txt += " " + momentos[i].txt; else sig.txt = momentos[i].txt + " " + sig.txt;
    momentos.splice(i, 1); i--; toco = true;
  }
  if (!toco) break;
}
for (let i = 0; i < momentos.length; i++) {
  if (momentos[i].txt.length >= 30) continue;
  const ant = momentos[i - 1], sig = momentos[i + 1];
  const dAnt = ant ? ant.txt.length : 1e9, dSig = sig ? sig.txt.length : 1e9;
  if (!ant && !sig) continue;
  if (dAnt <= dSig) ant.txt += " " + momentos[i].txt; else sig.txt = momentos[i].txt + " " + sig.txt;
  momentos.splice(i, 1); i--;
}

const WMP = `_v3/${SLUG}_wordms.json`;
const hayWM = fs.existsSync(WMP);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
let conMs = momentos.map((m) => ({ ...m }));
let desancladas = [];
if (hayWM) {
  const WM = JSON.parse(fs.readFileSync(WMP, "utf8"));
  const WAV = parseFloat(process.env.WAV_S || "0") || WM[WM.length - 1].ms / 1000 + 2;
  let cur = 0;
  conMs = momentos.map((m) => {
    const pal = m.txt.split(/\s+/).map(norm).filter(Boolean);
    const i0 = cur; cur += pal.length;
    const ok = WM[i0] && WM[i0].w === pal[0];
    return { ...m, i0, i1: Math.min(cur - 1, WM.length - 1), t: (WM[i0]?.ms ?? 0) / 1000, okAncla: ok };
  });
  conMs.forEach((m, i) => { const sig = conMs[i + 1]; m.dur = +(((sig ? sig.t : WAV) - m.t).toFixed(2)); });
  desancladas = conMs.filter((m) => !m.okAncla);
}

const out = conMs.map((m, i) => ({
  i, name: `${SLUG}_${String(i).padStart(3, "0")}`, sec: m.sec, txt: m.txt, chars: m.txt.length,
  ...(hayWM ? { t: +m.t.toFixed(2), dur: m.dur } : {}),
}));

fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_moments.json`, JSON.stringify(out, null, 1));

const porSec = {};
for (const m of out) porSec[m.sec] = (porSec[m.sec] || 0) + 1;
const chars = out.map((m) => m.chars).sort((a, b) => a - b);
console.log(`momentos ${out.length} · caracteres del guion ${raw.length} · párrafos ${parrafos.length}`);
console.log(`chars/momento · min ${chars[0]} · mediana ${chars[chars.length >> 1]} · max ${chars[chars.length - 1]}`);
console.log(`estimado a 15,6 c/s: ${(raw.length / 15.6 / 60).toFixed(1)} min · ${(raw.length / 15.6 / out.length).toFixed(2)} s por momento`);
console.log("momentos por sección:", JSON.stringify(porSec));
if (hayWM) {
  const durs = out.map((m) => m.dur).sort((a, b) => a - b);
  console.log(`ANCLAJE: ${out.length - desancladas.length}/${out.length} (${((1 - desancladas.length / out.length) * 100).toFixed(1)}%)`);
  console.log(`dur · min ${durs[0]} · mediana ${durs[durs.length >> 1]} · p75 ${durs[Math.floor(durs.length * .75)]} · max ${durs[durs.length - 1]}`);
  if (desancladas.length) { console.log("⛔ mal anclados:"); desancladas.slice(0, 6).forEach((m) => console.log("   " + m.txt.slice(0, 60))); process.exit(1); }
  if (out.some((m) => m.dur <= 0)) { console.log("⛔ hay momentos con dur <= 0"); process.exit(1); }
} else {
  console.log(`· sin _v3/${SLUG}_wordms.json todavía: momentos SIN ms (modo pre-audio)`);
}
