// finalize_broll_v8v252t7cjxe.mjs — cierra la capa de b-roll DESPUÉS de fetchstock + relleno IA.
// Gotcha documentado del canal (2026-07-26): Pexels free corta por 429 cerca de los ~200 clips/hora,
// así que en un video de 27 min la SEGUNDA MITAD se queda sin footage y el avatar en `hidden` sin
// clip detrás sale NEGRO. Acá se resuelve por clip, en cascada:
//   1) si bajó el mp4 de Pexels        → broll/<name>.mp4
//   2) si no, si hay imagen IA de relleno → img/bx_<name>.png  (on-topic, generada con la misma query)
//   3) si no hay ninguna              → se SACA del track y el plano anterior se estira
//      (eso además rompe la sucesión pareja: da planos largos, que es el ritmo que pidió el creador)
import fs from "fs";
const SLUG = "v8v252t7cjxe";

const kept = JSON.parse(fs.readFileSync(`public/broll/dense_thinned_${SLUG}.json`, "utf8"));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CW = caps.words || caps;
const VEND = ((CW[CW.length - 1]?.startMs || 1628000) / 1000) + 2;

const hasVid = (n) => fs.existsSync(`public/broll/${n}.mp4`);
const imgOf = (n) => ["png", "jpg", "jpeg", "webp"].map((e) => `img/bx_${n}.${e}`).find((p) => fs.existsSync(`public/${p}`));

const rows = [];
let nVid = 0, nImg = 0, nDrop = 0;
for (const k of kept) {
  if (hasVid(k.name)) { rows.push({ name: k.name, src: `broll/${k.name}.mp4`, t: k.t, query: k.query }); nVid++; continue; }
  const img = imgOf(k.name);
  if (img) { rows.push({ name: k.name, src: img, t: k.t, query: k.query }); nImg++; continue; }
  nDrop++;
}
rows.sort((a, b) => a.t - b.t);

const broll = rows.map((r, i) => ({
  name: r.name, src: r.src,
  start: r.t, dur: +(((i + 1 < rows.length ? rows[i + 1].t : VEND) - r.t)).toFixed(2),
  query: r.query,
}));

fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/finalize_broll_${SLUG}.mjs — b-roll REAL (Pexels) + relleno IA on-topic.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);

const gaps = broll.slice(1).map((b, i) => b.start - broll[i].start);
const srt = [...gaps].sort((a, b) => a - b);
const med = srt[Math.floor(srt.length / 2)] || 0;
const p90 = srt[Math.floor(srt.length * 0.9)] || 0;
const largos = gaps.filter((g) => g >= 5).length;
console.log(`b-roll final: ${broll.length} tomas · video ${nVid} · imagen IA ${nImg} · descartadas ${nDrop}`);
console.log(`ritmo: mediana ${med.toFixed(2)}s · p90 ${p90.toFixed(2)}s · planos >=5s: ${largos} (${(100 * largos / gaps.length).toFixed(0)}%)`);
// cobertura por tramo de 2 min (el TOTAL engaña: hay que mirar tramo por tramo)
const TR = 120, N = Math.ceil(VEND / TR), c = new Array(N).fill(0);
for (const b of broll) { const i = Math.floor(b.start / TR); if (i < N) c[i]++; }
console.log("tomas por tramo de 2min:", c.join(" "));
