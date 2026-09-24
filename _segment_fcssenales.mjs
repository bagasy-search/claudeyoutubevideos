// _segment_fcssenales.mjs — parte las captions en MOMENTOS con ritmo VARIADO.
// Regla de pacing (video-pipeline): mediana 3.5–4.5s · ~40% >=5s · p75 >5s · techo 12s.
// Corta SOLO en frontera de frase o de cláusula (coma/pausa real), nunca a mitad de idea.
import fs from "fs";

const SLUG = "fcssenales";
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
const caps = rd(`public/captions_${SLUG}.json`);
const W = (Array.isArray(caps) ? caps : caps.words).map((x) => ({
  t: x.text.trim(), s: x.startMs / 1000, e: x.endMs / 1000,
}));

const TARGET = 3.45;     // duración deseada de un momento
const MIN = 2.0;
const MAX = 11.5;

const isEnd = (t) => /[.!?…]$/.test(t);
const isSoft = (t) => /[,;:]$/.test(t);

const mom = [];
let cur = [], t0 = W[0].s;
for (let i = 0; i < W.length; i++) {
  cur.push(W[i]);
  const d = W[i].e - t0;
  const gap = i + 1 < W.length ? W[i + 1].s - W[i].e : 99;   // silencio real después de esta palabra
  const hard = isEnd(W[i].t);
  const soft = isSoft(W[i].t) || gap > 0.28;
  // corta si: pasó el target y hay frontera; o si se pasó del máximo y hay cualquier frontera blanda
  const corte = (d >= MIN && hard && d >= TARGET * 0.62)
    || (d >= TARGET && soft)
    || (d >= TARGET * 1.55 && gap > 0.14)
    || (d >= MAX && (soft || hard))
    || (d >= MAX + 2);
  if (corte && cur.length >= 3) {
    mom.push({ ws: cur, s: t0, e: W[i].e });
    cur = []; t0 = i + 1 < W.length ? W[i + 1].s : W[i].e;
  }
}
if (cur.length) mom.push({ ws: cur, s: t0, e: cur[cur.length - 1].e });

// merge de momentos demasiado cortos con el vecino más corto
for (let i = 0; i < mom.length; i++) {
  const d = mom[i].e - mom[i].s;
  if (d >= MIN || mom.length < 2) continue;
  const prev = i > 0 ? mom[i - 1] : null, next = i + 1 < mom.length ? mom[i + 1] : null;
  const dp = prev ? prev.e - prev.s : 1e9, dn = next ? next.e - next.s : 1e9;
  if (dp <= dn && prev) { prev.ws = prev.ws.concat(mom[i].ws); prev.e = mom[i].e; mom.splice(i, 1); i -= 2; }
  else if (next) { next.ws = mom[i].ws.concat(next.ws); next.s = mom[i].s; mom.splice(i, 1); i -= 1; }
}

const SEAM = rd(`_${SLUG}_seam.json`);
const out = mom.map((m, i) => {
  const next = i + 1 < mom.length ? mom[i + 1].s : SEAM.VIDEO_END;
  const text = m.ws.map((w) => w.t).join(" ").replace(/\s+([,.;:!?…])/g, "$1");
  return {
    n: "m" + String(i + 1).padStart(3, "0"),
    ms: +m.s.toFixed(2),
    dur: +(next - m.s).toFixed(2),
    anchor: m.ws.slice(0, 7).map((w) => w.t).join(" "),
    text,
  };
});
fs.writeFileSync(`_${SLUG}_moments.json`, JSON.stringify(out, null, 0));

const ds = out.map((m) => m.dur).sort((a, b) => a - b);
const q = (p) => ds[Math.floor(ds.length * p)];
console.log(`momentos: ${out.length}  ·  mediana ${q(0.5).toFixed(2)}s  p75 ${q(0.75).toFixed(2)}s  p90 ${q(0.9).toFixed(2)}s  max ${ds[ds.length - 1].toFixed(2)}s`);
console.log(`>=5s: ${(out.filter((m) => m.dur >= 5).length / out.length * 100).toFixed(0)}%   <2.4s: ${out.filter((m) => m.dur < 2.4).length}`);
console.log(`cobertura: ${out[out.length - 1].ms + out[out.length - 1].dur} / ${SEAM.VIDEO_END}`);
