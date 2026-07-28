// dense_prep_v43tq6jgz3dw.mjs — toma public/broll/dense_v43tq6jgz3dw.json ({at,query}) →
// resuelve cada 'at' al ms del caption, afina a ~2.3s, asigna nombres POR-SLUG (anti-colisión) y escribe:
//   public/broll/dense_thinned_v43tq6jgz3dw.json
//   public/broll/shots_dense_v43tq6jgz3dw.json  (para fetchstock)
//   src/_fed6/VideoEdit/federer_v43tq6jgz3dw_broll.ts  (FEDZ_BROLL, track contiguo)
//
// ★ AISLAMIENTO POR SLUG: los clips viven en public/broll/<SLUG>/ y se referencian como
//   broll/<SLUG>/bd_<SLUG>_NNN.mp4 — NUNCA broll/bd_NNN.mp4 (la carpeta compartida cruza videos).
//   Bajalos con:  node fetchstock.mjs public/broll/shots_dense_v43tq6jgz3dw.json --slug v43tq6jgz3dw
import fs from "fs";
const SLUG = "v43tq6jgz3dw";
const DIR = `broll/${SLUG}`;              // carpeta AISLADA de este video (public/broll/<slug>/)
const MINGAP = 2.2;
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const CAPW = caps.words || caps;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = CAPW.map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
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
// ★ El nombre del clip sale de un MAPA PERSISTENTE query→archivo (qmap_<slug>.json),
// no del índice: así reordenar o densificar el mapa NO desalinea los clips ya bajados.
const QMAP = JSON.parse(fs.readFileSync(`public/broll/qmap_${SLUG}.json`, "utf8"));
const nameOf = (q) => QMAP[q.toLowerCase().trim()];
// Solo se usan los clips que EXISTEN en disco (Pexels throttlea y deja huecos).
const have = new Set(fs.existsSync(`public/${DIR}`) ? fs.readdirSync(`public/${DIR}`).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, "")) : []);
let cursor = 0, kept = [], miss = 0, nofile = 0;
dense.forEach((b) => {
  const nm = nameOf(b.query);
  if (!nm || !have.has(nm)) { nofile++; return; }
  const t = findMs(b.at, Math.max(0, cursor - 1));
  if (t == null) { miss++; return; }
  if (t < cursor + MINGAP) return;
  cursor = t;
  kept.push({ name: nm, at: b.at, query: b.query, t: +t.toFixed(2) });
});
console.log(`(sin archivo en disco: ${nofile})`);
// shots para fetchstock: 'dir' documenta el destino AISLADO (fetchstock lo resuelve con --slug <SLUG>).
const shots = kept.map((k) => ({ name: k.name, query: k.query, type: "video", orientation: "landscape", dir: DIR }));
fs.mkdirSync(`public/${DIR}`, { recursive: true });
fs.writeFileSync(`public/broll/dense_thinned_${SLUG}.json`, JSON.stringify(kept, null, 1));
// ⚠️ NO pisar shots_dense_<slug>.json: esa es la lista COMPLETA de descarga (la arma
// el mapa qmap). Si se sobreescribe con los `kept`, el fetcher deja de pedir el resto
// y la descarga se estanca en silencio. El anclado va a su propio archivo.
fs.writeFileSync(`public/broll/shots_used_${SLUG}.json`, JSON.stringify(shots, null, 1));

const VEND = (CW[CW.length - 1]?.s || 1164) + 2;
const broll = kept.map((k, i) => ({
  name: k.name, src: `${DIR}/${k.name}.mp4`,
  start: k.t, dur: +(((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t)).toFixed(2),
  query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/dense_prep_${SLUG}.mjs — b-roll denso (footage real cada ~2.3s).\n` +
  `// Clips AISLADOS en public/${DIR}/ — referenciados como ${DIR}/bd_${SLUG}_NNN.mp4.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);
const gaps = kept.slice(1).map((k, i) => k.t - kept[i].t);
const avg = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
console.log(`dense: ${dense.length} → afinado ${kept.length} clips · sep media ${avg.toFixed(2)}s · no-ancladas ${miss}`);
console.log("primeros:", kept.slice(0, 4).map((k) => `${k.t}s ${k.query}`).join(" | "));
console.log(`bajar con:  node fetchstock.mjs public/broll/shots_dense_${SLUG}.json --slug ${SLUG}   → public/${DIR}/`);
