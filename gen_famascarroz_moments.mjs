// gen_famascarroz_moments.mjs (clon de gen_fabolsasojos_moments.mjs) — parte el GUION en momentos y (si ya existe el mapa) los ANCLA al ms.
// Clon de gen_fcscanas_moments.mjs. Tramo 1 = avatar v3 del creador; tramo 2 = Fish + RunPod por ventanas.
//   node gen_fcsmanos10_moments.mjs   # sin _v3/fcscanas_wordms.json: momentos SIN ms · con él: + ms real
import fs from "node:fs";

const SLUG = "famascarroz";
const OBJETIVO = 88, MIN = 48, MAX = 152;

const raw = fs.readFileSync(`guion_${SLUG}.txt`, "utf8").replace(/^﻿/, "").replace(/\r/g, "");
const parrafos = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

const ABRE = [
  ["Si alguna vez te echaron", "HOOK"],
  ["Vamos a la cocina.", "RECETA"],
  ["Esa es la base.", "LOOPS"],
  ["Déjame presentarme rapidito", "INTRO"],
  ["Ahora, ¿por qué japonesa?", "JAPON"],
  ["Y para eso tienes que entender", "MEC_PIEL"],
  ["Eso es lo que te hace ver", "MEC_EDAD"],
  ["Entonces, ¿qué pasa en esos diez minutos?", "DIEZMIN"],
  ["Y ahora lo honesto", "HONESTO"],
  ["Déjame contarte de alguien", "ROSA1"],
  ["Presten mucha atención a esta imagen", "LAMINA"],
  ["Y dicho sea de paso", "GUIA"],
  ["Bueno, vamos con lo primero", "ESPESOR"],
  ["Y la temperatura.", "TEMP"],
  ["Ahora el segundo error", "FERMENTO"],
  ["Y el tercero: dejarla secar", "SECAR"],
  ["Ahora, la prueba que le pedí", "PARCHE"],
  ["Y hay caras donde no", "NOPONER"],
  ["¿Cuántas veces?", "FRECUENCIA"],
  ["Y la variante", "VARIANTES"],
  ["Y ahora las manos.", "MANOS"],
  ["Y ahora el paso que casi todos", "DESPUES"],
  ["Y cómo se pone la mascarilla", "APLICAR"],
  ["Y si quieres ver con tus propios ojos", "MEDIACARA"],
  ["Y el agua para enjuagar", "ENJUAGUE"],
  ["Cuando le expliqué todo esto", "CTA2"],
  ["Ahora, las manchas.", "MANCHAS"],
  ["Entonces, ¿qué hace el arroz", "MANCHAS_ARROZ"],
  ["¿Y cuál protector?", "PROTECTOR"],
  ["Con eso, más la hidratación", "PLAZO"],
  ["Y un truco que les doy", "FOTO"],
  ["Y para que sepas qué esperar", "ESPERAR"],
  ["Ahora, las recetas que andan", "RECETAS"],
  ["Y otras preguntas que me hacen", "FAQ"],
  ["Y alguien preguntaba en un comentario", "ARSENICO"],
  ["Ahora quiero hablarte de algo importante", "ALARMA"],
  ["Y otra cosa que me preguntan", "MEDICACION"],
  ["Y ya que estamos, tres hábitos", "HABITOS"],
  ["Bueno. ¿Y qué pasó con doña Rosa?", "ROSA2"],
  ["Déjame repasarte todo", "REPASO"],
  ["Y te dejo el aviso", "AVISO"],
  ["La página que te mostré", "CTA3"],
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
console.log("momentos por sección:", JSON.stringify(porSec));
if (hayWM) {
  const durs = out.map((m) => m.dur).sort((a, b) => a - b);
  console.log(`ANCLAJE: ${out.length - desancladas.length}/${out.length} (${((1 - desancladas.length / out.length) * 100).toFixed(1)}%)`);
  console.log(`dur · min ${durs[0]} · mediana ${durs[durs.length >> 1]} · p75 ${durs[Math.floor(durs.length * .75)]} · max ${durs[durs.length - 1]}`);
  if (desancladas.length) { console.log("⛔ mal anclados:"); desancladas.slice(0, 6).forEach((m) => console.log("   " + m.txt.slice(0, 60))); process.exit(1); }
  if (out.some((m) => m.dur <= 0)) { console.log("⛔ hay momentos con dur <= 0"); process.exit(1); }
} else {
  console.log("· sin wordms todavía: momentos SIN ms (modo pre-audio)");
}
