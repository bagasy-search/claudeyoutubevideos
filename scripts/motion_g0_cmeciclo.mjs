// motion_g0_cmeciclo.mjs — movimiento LEVE para las 18 imágenes de las mini-frases.
//
// ⛔ Nunca "breathe/respirar" (deforma torso y cara). ⛔ Nada de zoom/pan/dolly ni cortes.
// El movimiento es el que la foto YA insinúa: si sostiene algo, termina el gesto; si es un objeto
// quieto, se mueve la LUZ o un detalle mínimo. Son planos de 2-4 s: alcanza con muy poco.
import fs from "node:fs";

const IGUAL = "Same garage, same workbench, same objects in the same positions, same clothing, same background, nothing appears or moves behind him.";
const IGUAL_OBJ = "Same place, same objects in the same positions, same background, nothing new appears in the frame.";

const M = [
  ["n001", IGUAL, "he lifts the battery a few centimetres higher and clear of the tray, his forearms tightening as the weight comes free"],
  ["n002", IGUAL, "his hands release the battery and slide back off its casing as he straightens up a little"],
  ["n003", IGUAL, "he presses the crocodile clamp closed onto the post and his fingers slip off it"],
  ["n004", IGUAL, "his eyes move down the phone screen and his eyebrows lift a little further"],
  ["n005", IGUAL_OBJ, "the reflection of the window slides slowly across the phone screen as the light shifts"],
  ["n007", IGUAL_OBJ, "the light on the bench shifts slowly and the shadow of the battery creeps a little across the wood"],
  ["n008", IGUAL_OBJ, "fine dust drifts slowly through the shaft of light reaching the corner"],
  ["n010", IGUAL, "his thumb drags once down the phone screen and stops"],
  ["n013", IGUAL, "he finishes the single nod and his lifted hand lowers slightly"],
  ["n014", IGUAL, "his fingers close around the clamp meter and he begins to lift it off the bench"],
  ["n015", IGUAL, "he lowers the deep-cycle battery the last few centimetres onto the bench and the carry strap settles against its side"],
  ["n016", IGUAL, "his hand pats the top of the battery once and stays there"],
  ["n017", IGUAL_OBJ, "the light across the battery top shifts slowly and the peeling sticker corner lifts very slightly"],
  ["n018", IGUAL_OBJ, "the cable running from the inverter to the fridge settles a little against the floor"],
  ["n019", IGUAL_OBJ, "the hanging clamp meter swings very slightly on its hook and comes to rest"],
  ["n020", IGUAL_OBJ, "the light on the bench shifts slowly across both batteries"],
  ["n021", IGUAL, "his hand runs a short way along the cable toward the inverter and stops"],
  ["n022", IGUAL_OBJ, "the digits of the running stopwatch tick forward on the phone screen"],
];

const out = M.map(([id, change, motion]) => ({ nombre: `cmeciclo_${id}`, change, motion }));
const malos = out.filter((o) => /breath|respir|zoom|dolly|\bpan\b|jump cut|new scene/i.test(`${o.motion} ${o.change}`));
console.log(`entradas ${out.length} · violaciones ${malos.length}`);
if (malos.length) { for (const m of malos) console.log("  ⛔", m.nombre); process.exit(1); }
fs.writeFileSync("_v3/cmeciclo_motion_G0.json", JSON.stringify(out, null, 1));
console.log("→ _v3/cmeciclo_motion_G0.json");
