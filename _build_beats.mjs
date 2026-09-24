// _build_beats.mjs — junta las secciones de _beats/*.mjs -> _v3/fedcolageno_beats.json
// Formato de entrada por momento: [anchor, escena_en_ingles, tipo?]   tipo: "hero" | "img"
//  - default            -> clip agnes TEXTO-A-VIDEO (motor por defecto, GRATIS, "mega dinamico")
//  - "img"              -> imagen agnes (para lo que no conviene animar)
//  - "hero"             -> gpt-image-2 low CON la cara del Dr. (ref_fedcolageno.png). ~12-15 por video.
// El estilo va en POSITIVO y CORTO (los negativos se dibujan): reference_agnes_api_imagenes_gratis.
import fs from "fs";

const SLUG = "fedcolageno";
const STYLE = "photorealistic, close view, the subject fills the frame, even soft light, natural muted colours, ordinary, plain, unstyled, the surface around the subject is bare and clear, no text";
const STYLE_HERO = "casual photo taken with a phone, plain indoor light, natural muted colours, nothing polished, ordinary clothes, imperfect framing";

const files = fs.readdirSync("_beats").filter((f) => f.endsWith(".mjs")).sort();
const CAPS = JSON.parse(fs.readFileSync(`public/captions_${SLUG}.json`, "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const CW = (CAPS.words || CAPS).map((x) => ({ t: norm(x.text), s: (x.startMs || 0) / 1000 }));
const findAll = (ph) => {
  const p = norm(ph).split(" ").filter(Boolean);
  const out = [];
  if (p.length < 3) return out;
  for (let i = 0; i <= CW.length - p.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) if (CW[i + j].t !== p[j]) { ok = false; break; }
    if (ok) out.push(+CW[i].s.toFixed(2));
  }
  return out;
};

const out = [];
const bad = [];
let n = 0, heroes = 0, imgs = 0;
for (const f of files) {
  const mod = await import(`./_beats/${f}?v=${Date.now()}`);
  for (const [anchor, scene, kind] of mod.default) {
    n++;
    const name = String(n).padStart(3, "0");
    const hits = findAll(anchor);
    if (hits.length === 0) bad.push([f, name, anchor]);
    const hero = kind === "hero";
    if (hero) heroes++;
    if (kind === "img") imgs++;
    out.push({
      name, anchor,
      desc: hero ? "HERO: Dr. Federer" : scene,
      mediakind: hero || kind === "img" ? "image" : "video",
      engine: hero ? "gpt" : kind === "img" ? "agnes_img" : "agnes_video",
      prompt: hero ? `${scene}. ${STYLE_HERO}` : `${scene}. ${STYLE}`,
      queries: [scene],
    });
  }
}
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_beats.json`, JSON.stringify(out, null, 1));
console.log(`momentos: ${out.length}   clips agnes: ${out.length - heroes - imgs}   imgs agnes: ${imgs}   HERO gpt-image: ${heroes}`);
if (bad.length) {
  console.log(`\n!! ANCLAS SIN MATCH: ${bad.length}`);
  for (const [f, nm, a] of bad) console.log(`   ${f} ${nm}  <- "${a}"`);
} else console.log("anclas: todas matchean");
