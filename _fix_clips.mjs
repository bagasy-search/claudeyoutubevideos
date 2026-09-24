// _fix_clips.mjs — reemplaza los clips que la auditoría marcó con defecto REAL.
// Defecto medido: cuando el prompt pide una ETIQUETA / LISTA / LETRA CHIQUITA, agnes dibuja
// glifos inventados legibles (queda "hecho por IA"). El arreglo NO es prohibir el texto —
// los negativos se dibujan — sino pedir la superficie EN BLANCO en positivo.
import fs from "node:fs";
const SLUG = "fedcolageno";
const ST = ". photorealistic, close view, the subject fills the frame, even soft light, natural muted colours, ordinary, plain, unstyled, the surface around the subject is bare and clear, no text";
const FIX = {
  "013": "an unmarked white cosmetic jar with a plain gold lid standing on a bright shop shelf, the jar surface is smooth and completely blank",
  "107": "a shopper's hand holding a smooth unmarked white cosmetic jar up close under bright shop light, the jar surface is bare",
  "109": "a hand turning a smooth unmarked white cosmetic jar around to look at its blank underside, bright shop light",
  "110": "a smooth blank white cosmetic package standing on a bright shop shelf, seen very close, the surface is completely bare",
  "118": "a tall glossy white plastic supplement tub with a completely blank smooth surface standing alone on a bright pharmacy shelf",
  "156": "two small clear glass jars of pale powder standing side by side on a plain shelf, the jars are unmarked and bare",
  "263": "a glossy plain white supplement tub with a completely blank smooth surface standing on a bright shop shelf",
  "386": "a plain white cardboard box lying open on a kitchen counter beside a small heap of colourless pale powder on a white plate, the box is completely blank",
  "426": "an empty dim bedroom at night with the bed made and the curtains drawn, nobody in the room, one small lamp switched off",
};
const out = Object.entries(FIX).map(([n, p]) => ({ nombre: `${SLUG}_${n}`, prompt_mov: p + ST }));
for (const n of Object.keys(FIX)) {
  const f = `public/broll/${SLUG}_${n}.mp4`;
  if (fs.existsSync(f)) { fs.mkdirSync("_rejected_clips", { recursive: true }); fs.copyFileSync(f, `_rejected_clips/${SLUG}_${n}.mp4`); fs.unlinkSync(f); }
}
fs.writeFileSync(`_v3/${SLUG}_clipfix.json`, JSON.stringify(out, null, 1));
console.log(`a regenerar ${out.length} clips (los viejos quedaron como _rejected_${SLUG}_NNN.mp4)`);
