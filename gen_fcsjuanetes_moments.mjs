// gen_fcsjuanetes_moments.mjs — parte el GUION en momentos y (si ya existe el mapa) los ANCLA al ms.
// Clon de gen_fcscanas_moments.mjs. Tramo 1 = avatar v3 del creador; tramo 2 = Fish + RunPod por ventanas.
//   node gen_fcsjuanetes_moments.mjs   # sin _v3/fcscanas_wordms.json: momentos SIN ms · con él: + ms real
import fs from "node:fs";

const SLUG = "fcsjuanetes";
const OBJETIVO = 88, MIN = 48, MAX = 152;

const raw = fs.readFileSync(`guion_${SLUG}.txt`, "utf8").replace(/^﻿/, "").replace(/\r/g, "");
// ⛔ "archivos-federer.vercel.app": el splitter de oraciones parte por el punto y convertia 1 palabra
// en 3 -> el cursor de anclaje se desfasaba 19 palabras (anclaje 31%). Se protege con un punto
// tipografico (U+2024) que norm() descarta igual, asi el conteo de palabras coincide con wordms.
const DOT = "․";
const rawP = raw.replace(/([a-z-]+)\.(vercel)\.(app)/gi, (m,a,b,c) => a+DOT+b+DOT+c);
const parrafosRaw = rawP.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

// Secciones = líneas "## Header" del guion; los párrafos antes del primer header van a HOOK.
const SECMAP = {
  "El ancla": "ANCLA", "El mito": "MITO", "El enemigo": "ENEMIGO", "El mecanismo": "MECANISMO",
  "beneficios reales": "BENEFICIOS", "La rutina completa": "RECETA",
  "Paso uno": "P1_ZAPATO", "Paso dos": "P2_SEPARADOR", "Paso tres": "P3_FERULA",
  "Paso cuatro": "P4_EJERCICIOS", "Paso cinco": "P5_REMOJO", "Paso seis": "P6_PLATO",
  "Paso siete": "P7_CONSTANCIA",
  "límites honestos": "LIMITES", "El ERROR": "ERROR", "El recap": "RECAP",
  "doña Remedios": "CIERRE_CASO", "La carnada": "CARNADA",
};
const secDe = (h) => { for (const k in SECMAP) if (h.includes(k)) return SECMAP[k]; return "OTRO"; };
const parrafos = [], secPorParrafo = [];
let cur = "HOOK";
for (const p of parrafosRaw) {
  if (/^#{2,6} /.test(p)) { cur = secDe(p.replace(/^#+ /, "").trim()); continue; }
  parrafos.push(p); secPorParrafo.push(cur);
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
const norm = (s) => s.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase().replace(/[^a-z0-9ñ]/g, "");
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
  const pctOk = 1 - desancladas.length / out.length;
  if (desancladas.length) { console.log(`⚠️ mal anclados (${desancladas.length}, ${(pctOk * 100).toFixed(1)}% OK):`); desancladas.slice(0, 6).forEach((m) => console.log("   " + m.txt.slice(0, 60))); }
  if (pctOk < 0.85) { console.log("⛔ anclaje por debajo del 85%: revisar tokenización"); process.exit(1); }
  if (out.some((m) => m.dur <= 0)) {
    console.log("⚠️ momentos con dur <= 0: se fuerza un mínimo de 0.8s (monotonía)");
    for (let i = 0; i < out.length; i++) if (out[i].dur <= 0) out[i].dur = 0.8;
  }
} else {
  console.log("· sin wordms todavía: momentos SIN ms (modo pre-audio)");
}
