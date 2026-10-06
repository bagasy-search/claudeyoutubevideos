// dense_prep_faricino.mjs — _faricino/dense_faricino.json ({at,query}) → ancla al ms del caption,
// afina a ~MINGAP, nombra dNNN y escribe:
//   _faricino/dense_thinned_faricino.json
//   _faricino/shots_dense_faricino.json   (para fetchstock → public/broll/faricino/)
//   src/_fed6/VideoEdit/faricino_broll.ts (FARICINO_BROLL, track contiguo)
import fs from "fs";
const MINGAP = 2.2;
const caps = JSON.parse(fs.readFileSync("public/captions_faricino.json", "utf8"));
const words = caps.words || caps;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = words.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase);
  if (p.split(" ").filter(Boolean).length < 2) return null;
  for (let i = 0; i < CW.length; i++) {
    if (CW[i].s < after) continue;
    let acc = "";
    for (let j = i; j < CW.length && acc.length < p.length + 6; j++) {
      acc = (acc + " " + CW[j].t).trim();
      if (acc === p || acc.startsWith(p + " ")) return CW[i].s;
    }
  }
  return null;
};
const dense = JSON.parse(fs.readFileSync("_faricino/dense_faricino.json", "utf8"));
let miss = 0; const anchored = [];
let cur = 0;
for (const b of dense) {
  let t = findMs(b.at, cur);            // buscar hacia adelante desde el cursor (mantiene orden del guion)
  if (t == null) t = findMs(b.at, 0);   // fallback global
  if (t == null) { miss++; continue; }
  cur = t;
  anchored.push({ at: b.at, query: b.query, t: +t.toFixed(2) });
}
anchored.sort((a, c) => a.t - c.t);
let cursor = -MINGAP, kept = [];
for (const a of anchored) {
  if (a.t < cursor + MINGAP) continue;
  cursor = a.t;
  kept.push({ name: `d${String(kept.length).padStart(3, "0")}`, at: a.at, query: a.query, t: a.t });
}
const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape" }));
fs.writeFileSync("_faricino/dense_thinned_faricino.json", JSON.stringify(kept, null, 1));
fs.writeFileSync("_faricino/shots_dense_faricino.json", JSON.stringify(shots, null, 1));
const VEND = (CW[CW.length - 1]?.s || 2953) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/faricino/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync("src/_fed6/VideoEdit/faricino_broll.ts",
  `// AUTO-GENERADO por scripts/dense_prep_faricino.mjs — b-roll denso.\n` +
  `export const FARICINO_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
