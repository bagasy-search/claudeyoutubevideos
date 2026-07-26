// finalize_broll_v8v252t741it.mjs — decide el SRC final de cada momento del track de b-roll.
// Pexels throttlea (429) y deja huecos; esos momentos se cubren con una foto IA propia
// (bx_<name>.png), que además queda más on-topic que el stock genérico. Prioridad:
//   1) el clip de Pexels        broll/<slug>/<name>.mp4     (si bajó)
//   2) la foto IA de relleno    img/bx_<name>.png           (si se generó)
//   3) se descarta el momento y el anterior se estira para cubrir el hueco
// Recalcula las duraciones contra el momento siguiente que SÍ tiene asset.
import fs from "fs";
const SLUG = "v8v252t741it";
const AVATAR_END = 2074.05;

const thin = JSON.parse(fs.readFileSync(`public/broll/dense_thinned_${SLUG}.json`, "utf8"));
const caps = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const VEND = Math.min(((caps.words || caps).slice(-1)[0].startMs / 1000) + 1.6, AVATAR_END);

let nVid = 0, nImg = 0, nDrop = 0;
const kept = [];
for (const k of thin) {
  const mp4 = `public/broll/${SLUG}/${k.name}.mp4`;
  // las imágenes de relleno se convierten a JPG (png2jpg) para que el tar entre en 2 GB
  // el relleno se nombra reemplazando el prefijo: bd_<slug>_NNN → bx_<slug>_NNN (no anteponiendo bx_)
  const fillBase = k.name.replace(/^bd_/, "bx_");
  const fill = ["jpg", "png"].map((e) => `img/${fillBase}.${e}`).find((p) => fs.existsSync(`public/${p}`));
  if (fs.existsSync(mp4) && fs.statSync(mp4).size > 20000) { kept.push({ ...k, src: `broll/${SLUG}/${k.name}.mp4`, kind: "vid" }); nVid++; }
  else if (fill) { kept.push({ ...k, src: fill, kind: "img" }); nImg++; }
  else nDrop++;
}

const broll = kept.map((k, i) => ({
  name: k.name,
  src: k.src,
  start: k.t,
  // la foto fija no aguanta tanto en pantalla como un clip: se topea más corto
  dur: +Math.min((i + 1 < kept.length ? kept[i + 1].t : VEND) - k.t, k.kind === "img" ? 4.2 : 6).toFixed(2),
  query: k.query,
}));
fs.writeFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`,
  `// AUTO-GENERADO por scripts/finalize_broll_${SLUG}.mjs — track final: ${nVid} clips de Pexels\n` +
  `// + ${nImg} fotos IA de relleno (los huecos que dejó el throttle 429), todo aislado por slug.\n` +
  `export const FEDZ_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(broll)};\n`);

// cobertura por tramo, para ver de un vistazo si quedó algún agujero
const NB = 12;
const bins = Array.from({ length: NB }, () => 0);
for (const b of broll) bins[Math.min(NB - 1, Math.floor(b.start / VEND * NB))]++;
console.log(`track final: ${broll.length} momentos · ${nVid} video · ${nImg} foto IA · ${nDrop} descartados`);
console.log("por tramo:", bins.join(" "));
const flojo = bins.map((n, i) => (n < 12 ? `${Math.round(i * VEND / NB)}s` : null)).filter(Boolean);
if (flojo.length) console.log("⚠ tramos flojos:", flojo.join(" "));
