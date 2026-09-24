// _align_avatar.mjs — alinea el VIDEO del avatar (HeyGen, 1909s) contra el AUDIO master (Fish, 1859s).
// Ambos dicen el MISMO guion, pero con ritmos distintos (deriva medida: +6s al minuto 2, +49s al minuto 30).
// Como el audio del avatar se descarta, se puede time-warpear el video libremente:
//   1) se buscan n-gramas de 5 palabras UNICOS en los dos transcripts -> pares (master_t, avatar_t)
//   2) se filtra a anclas monotonas y bien espaciadas (~25s)
//   3) por cada tramo se calcula factor = dur_master / dur_avatar  (correccion chica, ±5%)
//   4) se emite un .txt con los tramos para que ffmpeg los recorte, ajuste con setpts y concatene
import fs from "fs";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const load = (p) => {
  const c = JSON.parse(fs.readFileSync(p, "utf8"));
  return (c.words || c).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 })).filter((x) => x.t);
};
const A = load("public/captions_fedcolageno.json");   // master (audio final)
const B = load("public/captions_fedcolagenoav.json"); // avatar (video)

const K = 5;
const gramIndex = (W) => {
  const m = new Map();
  for (let i = 0; i + K <= W.length; i++) {
    const g = W.slice(i, i + K).map((x) => x.t).join(" ");
    if (!m.has(g)) m.set(g, []);
    m.get(g).push(W[i].s);
  }
  return m;
};
const GA = gramIndex(A), GB = gramIndex(B);

// pares candidatos: n-grama que aparece UNA sola vez en cada lado
const pairs = [];
for (const [g, av] of GA) {
  if (av.length !== 1) continue;
  const bv = GB.get(g);
  if (!bv || bv.length !== 1) continue;
  pairs.push([av[0], bv[0]]);
}
pairs.sort((x, y) => x[0] - y[0]);

// cadena monotona creciente en AMBOS ejes + separacion minima
const MIN_GAP = 20;
const anchors = [[0, 0]];
for (const [ma, av] of pairs) {
  const [lm, lv] = anchors[anchors.length - 1];
  if (ma - lm < MIN_GAP || av - lv < MIN_GAP) continue;
  const f = (ma - lm) / (av - lv);
  if (f < 0.8 || f > 1.25) continue; // descarta saltos absurdos (falso match)
  anchors.push([+ma.toFixed(3), +av.toFixed(3)]);
}
const DUR_M = 1844.727914, DUR_A = 1909.083;
anchors.push([DUR_M, DUR_A]);

console.log(`pares unicos: ${pairs.length}  -> anclas usadas: ${anchors.length}`);
const segs = [];
for (let i = 0; i < anchors.length - 1; i++) {
  const [m0, a0] = anchors[i], [m1, a1] = anchors[i + 1];
  const dm = m1 - m0, da = a1 - a0;
  segs.push({ i, av_from: a0, av_to: a1, dur_av: +da.toFixed(3), dur_ma: +dm.toFixed(3), factor: +(dm / da).toFixed(6) });
}
const fs_ = segs.map((s) => s.factor).sort((a, b) => a - b);
console.log(`tramos: ${segs.length}  factor min ${fs_[0]}  mediana ${fs_[Math.floor(fs_.length / 2)]}  max ${fs_[fs_.length - 1]}`);
console.log(`suma master ${segs.reduce((a, s) => a + s.dur_ma, 0).toFixed(1)}s  suma avatar ${segs.reduce((a, s) => a + s.dur_av, 0).toFixed(1)}s`);
fs.writeFileSync("_avatar_segments.json", JSON.stringify(segs, null, 1));
console.log("-> _avatar_segments.json");
