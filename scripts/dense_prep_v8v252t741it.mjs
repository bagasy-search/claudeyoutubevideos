// dense_prep_v8v252t741it.mjs — junta los 3 mapas de b-roll de los DIRECTORES
// (_broll_segN_v8v252t741it.json, cada uno {at,query}), resuelve cada `at` al ms del caption,
// afina a ~2.4s de separación, y escribe:
//   public/broll/dense_v8v252t741it.json          (manifiesto, para fetchstock --slug)
//   public/broll/shots_dense_v8v252t741it.json
//   src/_fed6/VideoEdit/federer_v8v252t741it_broll.ts   (FEDZ_BROLL, track contiguo)
// ★ AISLAMIENTO: los clips se referencian SIEMPRE como broll/<slug>/<name>.mp4 — nunca a pelo.
import fs from "fs";
const SLUG = "v8v252t741it";
const MINGAP = 2.4;
const SEG_FLOOR = { 1: 0, 2: 700, 3: 1400 };

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i <= CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true; for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

const dense = [];
for (const n of [1, 2, 3]) {
  const f = `_broll_seg${n}_${SLUG}.json`;
  if (!fs.existsSync(f)) { console.error(`✗ falta ${f}`); process.exit(1); }
  for (const b of JSON.parse(fs.readFileSync(f, "utf8"))) dense.push({ ...b, floor: SEG_FLOOR[n] });
}
console.log(`entradas de los 3 directores: ${dense.length}`);

const CLIP = (i) => `bd_${SLUG}_${String(i).padStart(3, "0")}`;
let cursor = 0, kept = [], miss = 0, tooClose = 0;
const seenQ = new Map();
for (const b of dense) {
  const t = findMs(b.at, Math.max(b.floor || 0, cursor - 0.5));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) { tooClose++; continue; }
  cursor = t;
  // ⛔ NO REPETIR CLIPS (regla del creador): si dos entradas piden la misma query, se desambigua
  const q = String(b.query).trim();
  const nq = seenQ.get(q.toLowerCase()) || 0;
  seenQ.set(q.toLowerCase(), nq + 1);
  kept.push({ name: CLIP(kept.length), at: b.at, query: q, dedupe: nq, t: +t.toFixed(2) });
}
const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape", skip: k.dedupe }));
fs.mkdirSync("public/broll", { recursive: true });
fs.writeFileSync(`public/broll/dense_${SLUG}.json`, JSON.stringify(shots, null, 1));
fs.writeFileSync(`public/broll/shots_dense_${SLUG}.json`, JSON.stringify(shots, null, 1));
fs.writeFileSync(`public/broll/dense_thinned_${SLUG}.json`, JSON.stringify(kept, null, 1));

const AVATAR_END = 2074.05;
const VEND = Math.min((CW[CW.length - 1]?.s || 2073) + 1.6, AVATAR_END);
const broll = kept.map((k, i) => ({
  name: k.name,
  src: `broll/${SLUG}/${k.name}.mp4`,   // ★ aislado por slug
  start: k.t,
  dur: +Math.min((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t, 6).toFixed(2),
  query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/dense_prep_${SLUG}.mjs — b-roll denso, aislado en broll/${SLUG}/.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);

const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`afinado: ${kept.length} clips · sep media ${avg.toFixed(2)}s · no ancladas ${miss} · muy juntas ${tooClose}`);
console.log(`queries distintas: ${seenQ.size} · repetidas: ${kept.length - seenQ.size}`);
console.log(`cobertura: ${kept[0]?.t}s → ${kept[kept.length - 1]?.t}s (video ${VEND.toFixed(0)}s)`);
