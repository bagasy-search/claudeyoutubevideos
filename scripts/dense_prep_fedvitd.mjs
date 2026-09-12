// dense_prep_fedvitd.mjs — toma public/broll/dense_fedvitd.json ({at,query}) →
// resuelve cada 'at' al ms del caption, afina a ~2.3s, asigna dNNN y escribe:
//   public/broll/dense_thinned_fedvitd.json
//   public/broll/shots_dense_fedvitd.json  (para fetchstock)
//   src/_fed6/VideoEdit/federer_fedvitd_broll.ts  (FEDZ_BROLL, track contiguo)
// AISLAMIENTO: los clips viven en public/broll/fedvitd/dNNN.mp4 (fetchstock --slug fedvitd).
import fs from "fs";
const SLUG = "fedvitd";
const MINGAP = 2.2;
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = caps.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
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
const dense = JSON.parse(fs.readFileSync(`public/broll/dense_${SLUG}.json`, "utf8"));
let cursor = 0, kept = [], miss = 0;
for (const b of dense) {
  const t = findMs(b.at, Math.max(0, cursor - 1));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) continue;
  cursor = t;
  kept.push({ name: `d${String(kept.length).padStart(3, "0")}`, at: b.at, query: b.query, t: +t.toFixed(2) });
}
const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape" }));
fs.writeFileSync(`public/broll/dense_thinned_${SLUG}.json`, JSON.stringify(kept, null, 1));
fs.writeFileSync(`public/broll/shots_dense_${SLUG}.json`, JSON.stringify(shots, null, 1));

const VEND = (CW[CW.length - 1]?.s || 2012) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `broll/${SLUG}/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/dense_prep_${SLUG}.mjs — b-roll denso (footage real cada ~2.3s).\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
console.log("primeros:", kept.slice(0, 4).map((k) => `${k.t}s ${k.query}`).join(" | "));
