// moments.mjs (famarioneta) — parte el GUION en momentos y, si ya existe el mapa de palabras al ms, los ANCLA.
//   node work/famarioneta/moments.mjs
// Los momentos particionan las palabras del guion EN ORDEN (cursor), nunca buscando su texto literal.
import fs from "node:fs";

const SLUG = "famarioneta";
const OBJETIVO = 80, MIN = 40, MAX = 140;
const raw = fs.readFileSync(`guion_${SLUG}.txt`, "utf8").replace(/^﻿/, "").replace(/\r/g, "");
const parrafos = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

const ABRE = [
  ["¿Te ha pasado que estás tranquila", "HOOK"],
  ["Manos limpias, un espejo", "RUTINA"],
  ["Pero hay tres cosas", "LOOPS"],
  ["Déjame presentarme", "INTRO"],
  ["Ahora déjame contarte de alguien", "ROSARIO"],
  ["Y la respuesta honesta es", "MECANISMO"],
  ["Y aquí te quiero contestar", "MITO"],
  ["Presten mucha atención", "LAMINA"],
  ["Y dicho sea de paso", "CTA1"],
  ["Bueno. Ahora sí, vamos a hacerla", "PREP"],
  ["Ejercicio uno.", "EJ1"],
  ["Ejercicio dos.", "EJ2"],
  ["Ejercicio tres.", "EJ3"],
  ["Y ahora sí, lo que te prometí", "CINCO_SEG"],
  ["Ejercicio cuatro.", "EJ4"],
  ["Ahora sí, lo de doña Rosario.", "APRIETA"],
  ["Ejercicio cinco.", "EJ5"],
  ["Y aquí va la variante.", "VARIANTE"],
  ["Mira, muchas señoras", "CTA2"],
  ["Vamos con los tres errores", "ERRORES"],
  ["Y ya que estamos, me preguntan mucho por el yoga", "YOGA"],
  ["Ahora, las señales de alarma.", "ALARMA"],
  ["Bueno. ¿Y qué pasó con doña Rosario?", "RESULTADO"],
  ["Ahora déjame contestar tres preguntas", "PREGUNTAS"],
  ["Déjame repasarte la rutina", "REPASO"],
  ["Y te dejo el aviso", "AVISO"],
  ["La página de la rutina que te mostré", "CTA3"],
  ["Y ahora cuéntame tú", "CIERRE"],
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

const frasesDe = (p) => p.match(/[^.!?…]+[.!?…»]*\s*/g)?.map((s) => s.trim()).filter(Boolean) ?? [p];
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
  let buf = "";
  const empujar = () => { if (buf) { momentos.push({ sec, ip, txt: buf }); buf = ""; } };
  for (const f of frasesDe(p).flatMap(partirLarga)) {
    if (!buf) buf = f;
    else if ((buf + " " + f).length <= OBJETIVO + 24) buf += " " + f;
    else { empujar(); buf = f; }
    if (buf.length >= OBJETIVO) empujar();
  }
  empujar();
});
// fusionar cortos dentro del mismo párrafo (o párrafo de un solo momento con su vecino de la MISMA sección)
for (let pasada = 0; pasada < 5; pasada++) {
  let toco = false;
  for (let i = 0; i < momentos.length; i++) {
    if (momentos[i].txt.length >= MIN) continue;
    const ant = momentos[i - 1], sig = momentos[i + 1];
    const mismo = (x) => x && (x.ip === momentos[i].ip || x.sec === momentos[i].sec);
    const cabeAnt = mismo(ant) && (ant.txt + " " + momentos[i].txt).length <= MAX;
    const cabeSig = mismo(sig) && (momentos[i].txt + " " + sig.txt).length <= MAX;
    let d = null;
    if (cabeAnt && cabeSig) d = ant.txt.length <= sig.txt.length ? "ant" : "sig"; else if (cabeAnt) d = "ant"; else if (cabeSig) d = "sig";
    if (!d) continue;
    if (d === "ant") ant.txt += " " + momentos[i].txt; else { sig.txt = momentos[i].txt + " " + sig.txt; sig.ip = momentos[i].ip; }
    momentos.splice(i, 1); i--; toco = true;
  }
  if (!toco) break;
}

const WMP = `_v3/${SLUG}_wordms.json`;
const hayWM = fs.existsSync(WMP);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
let conMs = momentos.map((m) => ({ ...m }));
let malas = [];
if (hayWM) {
  const WM = JSON.parse(fs.readFileSync(WMP, "utf8"));
  const WAV = parseFloat(process.env.WAV_S || "0") || WM[WM.length - 1].ms / 1000 + 1.5;
  let cur = 0;
  conMs = momentos.map((m) => {
    const pal = m.txt.split(/\s+/).map(norm).filter(Boolean);
    const i0 = cur; cur += pal.length;
    return { ...m, i0, t: (WM[i0]?.ms ?? 0) / 1000, ok: WM[i0] && WM[i0].w === pal[0] };
  });
  if (cur !== WM.length) { console.log(`⛔ palabras de momentos ${cur} ≠ mapa ${WM.length}`); process.exit(1); }
  conMs.forEach((m, i) => { const s = conMs[i + 1]; m.dur = +(((s ? s.t : WAV) - m.t).toFixed(2)); });
  malas = conMs.filter((m) => !m.ok);
}
const out = conMs.map((m, i) => ({ i, name: `m${String(i).padStart(3, "0")}`, sec: m.sec, txt: m.txt, ...(hayWM ? { t: +m.t.toFixed(3), dur: m.dur } : {}) }));
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_moments.json`, JSON.stringify(out, null, 1));
const porSec = {}; for (const m of out) porSec[m.sec] = (porSec[m.sec] || 0) + 1;
console.log(`momentos ${out.length} · chars ${raw.length} · por sección ${JSON.stringify(porSec)}`);
if (hayWM) {
  const d = out.map((m) => m.dur).sort((a, b) => a - b);
  console.log(`ANCLAJE primera palabra ${out.length - malas.length}/${out.length} · dur mediana ${d[d.length >> 1]} p75 ${d[Math.floor(d.length * .75)]} max ${d[d.length - 1]}`);
  if (out.some((m) => m.dur <= 0)) { console.log("⛔ momentos con dur <= 0"); process.exit(1); }
}
