// dense_prep_v3iuzgxce9vg.mjs — toma public/broll/dense_v3iuzgxce9vg.json ({at,query}) →
// resuelve cada 'at' al ms exacto del caption, afina a >=MINGAP, nombra POR-SLUG y escribe:
//   public/broll/dense_thinned_v3iuzgxce9vg.json
//   public/broll/shots_dense_v3iuzgxce9vg.json   (para el fetcher)
//   src/_fed6/VideoEdit/federer_v3iuzgxce9vg_broll.ts  (FEDZ_BROLL, track contiguo)
// ⛔ AISLAMIENTO: src apunta a broll/<SLUG>/<name>.mp4 (no a broll/ a pelo) — lo exige broll_isolation_gate.
import fs from "fs";

const SLUG = "v3iuzgxce9vg";
const MINGAP = 2.4;   // separacion minima entre clips
const MAXDUR = 6.0;   // ningun clip de b-roll se queda mas de 6s en pantalla

const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findMs = (phrase, after = 0) => {
  const p = norm(phrase).split(" ").filter(Boolean).slice(0, 6);
  if (p.length < 2) return null;
  for (let i = 0; i < CW.length - p.length; i++) {
    if (CW[i].s < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) return CW[i].s;
  }
  return null;
};

const dense = JSON.parse(fs.readFileSync(`public/broll/dense_${SLUG}.json`, "utf8"));
const CLIP = (i) => `bd_${SLUG}_${String(i).padStart(3, "0")}`;

let cursor = -99, kept = [], miss = 0, tooClose = 0, dup = 0;
// ⛔ "no repetir clips": la misma query solo se admite de nuevo si pasaron >90s (y el fetcher
// deduplica por id de Pexels, asi que devuelve OTRO video, no el mismo archivo).
const seenQ = new Map();
for (const b of dense) {
  const t = findMs(b.at, Math.max(0, cursor - 0.5));
  if (t == null) { miss++; continue; }
  if (t < cursor + MINGAP) { tooClose++; continue; }
  const q = String(b.query || "").trim().toLowerCase();
  if (!q) { dup++; continue; }
  if (seenQ.has(q) && t - seenQ.get(q) < 90) { dup++; continue; }
  seenQ.set(q, t);
  cursor = t;
  kept.push({ name: CLIP(kept.length), at: b.at, query: b.query, t: +t.toFixed(2) });
}

const shots = kept.map((k) => ({ name: k.name, query: k.query }));
fs.writeFileSync(`public/broll/dense_thinned_${SLUG}.json`, JSON.stringify(kept, null, 1));
fs.writeFileSync(`public/broll/shots_dense_${SLUG}.json`, JSON.stringify(shots, null, 1));

const VEND = (CW[CW.length - 1]?.s || 1415) + 2;
const broll = kept.map((k, i) => {
  const next = i + 1 < kept.length ? kept[i + 1].t : VEND;
  return {
    name: k.name,
    src: `broll/${SLUG}/${k.name}.mp4`,   // ⛔ aislado por slug
    start: k.t,
    dur: +Math.min(MAXDUR, next - k.t).toFixed(2),
    query: k.query,
  };
});
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/dense_prep_${SLUG}.mjs — b-roll denso aislado en broll/${SLUG}/.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);

const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
const sorted = [...gaps].sort((a, b) => a - b);
const med = sorted[Math.floor(sorted.length / 2)] || 0;
console.log(`dense: ${dense.length} → ${kept.length} clips · sep media ${avg.toFixed(2)}s · mediana ${med.toFixed(2)}s · no-ancladas ${miss} · muy juntas ${tooClose} · repetidas ${dup}`);
console.log(`cobertura: ${kept[0]?.t.toFixed(0)}s → ${kept[kept.length - 1]?.t.toFixed(0)}s (video ${VEND.toFixed(0)}s)`);
