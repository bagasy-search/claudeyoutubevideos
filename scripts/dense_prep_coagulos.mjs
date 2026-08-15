// dense_prep_coagulos.mjs — toma public/broll/dense_coagulos.json ({at,query}) → resuelve cada
// 'at' al ms del caption, afina a ~2.3s de separación, asigna nombres dNNN y escribe:
//   public/broll/dense_thinned_coagulos.json   [{name, at, query, t}]
//   public/broll/shots_dense_coagulos.json     [{name, query, type:"video", orientation:"landscape"}]  (para fetchstock)
//   src/_fed6/VideoEdit/coagulos_broll.ts  (COAG_BROLL, track contiguo)
import fs from "fs";
const MINGAP = 2.2;
const caps = JSON.parse(fs.readFileSync("public/captions_coagulos.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = caps.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
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
const dense = JSON.parse(fs.readFileSync("public/broll/dense_coagulos.json", "utf8"));
// anclar cada frase a su primera aparición GLOBAL (sin cursor), ordenar por tiempo, afinar por MINGAP
let miss = 0; const anchored = [];
for (const b of dense) {
  const t = findMs(b.at, 0);
  if (t == null) { miss++; continue; }
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
fs.writeFileSync("public/broll/dense_thinned_coagulos.json", JSON.stringify(kept, null, 1));
fs.writeFileSync("public/broll/shots_dense_coagulos.json", JSON.stringify(shots, null, 1));

const VEND = (CW[CW.length - 1]?.s || 920) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/coagulos/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync("src/_fed6/VideoEdit/coagulos_broll.ts",
  `// AUTO-GENERADO por scripts/dense_prep_coagulos.mjs — b-roll denso (footage real cada ~2.3s).\n` +
  `export const COAG_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
console.log("primeros:", kept.slice(0, 4).map((k) => `${k.t}s ${k.query}`).join(" | "));
