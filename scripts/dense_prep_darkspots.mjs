// dense_prep_darkspots.mjs — public/broll/dense_darkspots.json ({at,query}) → resuelve 'at' al ms del caption,
// afina a ~MINGAP de separación, asigna dNNN y escribe:
//   public/broll/dense_thinnedDS.json · public/broll/shots_denseDS.json · src/_fed6/VideoEdit/darkspots_broll.ts (DS_BROLL)
import fs from "fs";
const MINGAP = 2.5;
const caps = JSON.parse(fs.readFileSync("public/captions_darkspots.json", "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (caps.words || caps).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};
const dense = JSON.parse(fs.readFileSync("public/broll/dense_darkspots.json", "utf8"));
let cursor = 0, kept = [], miss = 0;
for (const b of dense) {
  const t = findMs(b.at, Math.max(0, cursor - 1));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) continue;
  cursor = t;
  kept.push({ name: `d${String(kept.length).padStart(3, "0")}`, at: b.at, query: b.query, t: +t.toFixed(2) });
}
const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape" }));
fs.writeFileSync("public/broll/dense_thinnedDS.json", JSON.stringify(kept, null, 1));
fs.writeFileSync("public/broll/shots_denseDS.json", JSON.stringify(shots, null, 1));

const VEND = (CW[CW.length - 1]?.s || 1090) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/darkspots/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync("src/_fed6/VideoEdit/darkspots_broll.ts",
  `// AUTO-GENERADO por scripts/dense_prep_darkspots.mjs — b-roll denso (footage real Pexels).\n` +
  `export const DS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
