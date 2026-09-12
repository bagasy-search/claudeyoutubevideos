// moments_dale4.mjs — guion + wordms -> _v3/dale3_moments.json  [{t, txt, i, dur, sec}]
//
//   node scripts/moments_dale3.mjs [slug]
//
// Un "momento" es UN PLANO. La regla del canal: cada plano muestra lo que se dice EN ESE SEGUNDO,
// asi que el corte va en frontera de frase (o de coma, si la frase es larga), NUNCA cada N segundos.
// Objetivo medido del canal: mediana 3,5-4,5 s · p75 > 5 s · 36-43 % de planos >= 5 s.
import fs from "node:fs";

const SLUG = process.argv[2] || "dale4";
const MIN_S = 1.6;    // por debajo -> se pega al vecino
const MAX_S = 6.2;    // por encima -> se parte en la coma mas centrada
const FIN_PAD = 2.1;  // cola del ultimo plano

const guion = fs.readFileSync(`canales/${SLUG}_GUION.txt`, "utf8").replace(/\r/g, "");
const wm = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, "utf8"));

// off -> t (el primer token que empieza en ese offset)
const tDe = new Map();
for (const x of wm) if (!tDe.has(x.off)) tDe.set(x.off, x.t);
const offs = [...tDe.keys()].sort((a, b) => a - b);
const tEn = (off) => {
  if (tDe.has(off)) return tDe.get(off);
  let lo = 0, hi = offs.length - 1, best = offs[0];
  while (lo <= hi) { const m = (lo + hi) >> 1; if (offs[m] <= off) { best = offs[m]; lo = m + 1; } else hi = m - 1; }
  return tDe.get(best);
};

// ── 1) cortar en frases, arrastrando el offset absoluto ──────────────────────────────────────────
const frases = [];
{
  const re = /[^.!?\n]+[.!?]*/g;
  let m;
  while ((m = re.exec(guion))) {
    const raw = m[0];
    const txt = raw.trim();
    if (!txt) continue;
    frases.push({ off: m.index + (raw.length - raw.replace(/^\s+/, "").length), txt });
  }
}

// ── 2) partir las largas por comas / conjunciones ────────────────────────────────────────────────
const trozos = [];
for (const f of frases) {
  let piezas = [f];
  for (let vuelta = 0; vuelta < 4; vuelta++) {
    const sig = [];
    let partio = false;
    for (const p of piezas) {
      const t0 = tEn(p.off), t1 = tEn(p.off + p.txt.length);
      if (t1 - t0 <= MAX_S) { sig.push(p); continue; }
      // corte candidato: la coma / punto y coma mas cercana al medio
      const cortes = [];
      const re2 = /,\s+|;\s+|\s+(?:and|but|because|which|so that|so|while|until)\s+/g;
      let c;
      while ((c = re2.exec(p.txt))) cortes.push(c.index + c[0].length);
      if (!cortes.length) { sig.push(p); continue; }
      const mid = p.txt.length / 2;
      const k = cortes.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
      if (k < 18 || p.txt.length - k < 18) { sig.push(p); continue; }
      sig.push({ off: p.off, txt: p.txt.slice(0, k).trim() });
      sig.push({ off: p.off + k, txt: p.txt.slice(k).trim() });
      partio = true;
    }
    piezas = sig;
    if (!partio) break;
  }
  trozos.push(...piezas);
}

// ── 3) pegar los cortos al vecino ────────────────────────────────────────────────────────────────
const mom = [];
for (const p of trozos) {
  const t0 = tEn(p.off);
  const prev = mom[mom.length - 1];
  if (prev && t0 - prev.t < MIN_S) { prev.txt += " " + p.txt; continue; }
  mom.push({ t: +t0.toFixed(2), txt: p.txt });
}

// ── 4) seccion ── dale4 va en el ORDEN EN QUE PEGAN, 7 items, no cuenta regresiva
const NUM = ["one","two","three","four","five","six","seven"];
let sec = "HOOK";
let vistos = 0;
for (const m of mom) {
  const mm = m.txt.match(/^Number (\w+)\./i);
  if (mm) {
    const n = NUM.indexOf(mm[1].toLowerCase()) + 1;
    if (n > vistos) { vistos = n; sec = "S" + n; }
  } else if (sec === "HOOK" && /^My name is Dale Kessler/.test(m.txt)) sec = "INTRO";
  m.sec = sec;
}
const iCierre = mom.findIndex((m) => /^That is the seven\./.test(m.txt));
if (iCierre > 0) for (let i = iCierre; i < mom.length; i++) mom[i].sec = "CIERRE";

// ── 5) duraciones ────────────────────────────────────────────────────────────────────────────────
const {execFileSync} = await import("node:child_process");
const WAV_S = parseFloat(execFileSync("C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe",
  ["-v","error","-show_entries","format=duration","-of","csv=p=0",`public/${SLUG}.wav`], {encoding:"utf8"}).trim());
for (let i = 0; i < mom.length; i++) {
  mom[i].i = i;
  const fin = i + 1 < mom.length ? mom[i + 1].t : Math.min(WAV_S, mom[i].t + FIN_PAD);
  mom[i].dur = +(fin - mom[i].t).toFixed(2);
}
const orden = mom.map((m) => ({ t: m.t, txt: m.txt, i: m.i, dur: m.dur, sec: m.sec }));
fs.writeFileSync(`_v3/${SLUG}_moments.json`, JSON.stringify(orden, null, 1));

const durs = orden.map((m) => m.dur).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)];
const largos = 100 * durs.filter((d) => d >= 5).length / durs.length;
console.log(`momentos ${orden.length} · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · >=5s ${largos.toFixed(0)}%`);
console.log(`wav ${(WAV_S/60).toFixed(2)} min · ultimo momento t=${orden[orden.length-1].t}`);
const porSec = {};
for (const m of orden) porSec[m.sec] = (porSec[m.sec] || 0) + 1;
console.log("secciones:", Object.entries(porSec).map(([k,v]) => `${k}:${v}`).join(" "));
