// motion_g0_retry_cmeciclo.mjs — segunda pasada de los 8 que agnes REDIBUJÓ.
//
// CAUSA (medida): a los planos de OBJETO les pedí movimientos vagos — "la luz se corre despacio",
// "flota polvo en el haz", "el cable se asienta". Sin una acción física concreta que animar, agnes
// rellena inventando OTRA escena: 7 de los 8 redibujados eran planos de objeto.
// ARREGLO: una acción CONCRETA y acotada en cada uno, con un sujeto que de verdad se mueve.
import fs from "node:fs";

const IGUAL_OBJ = "Same place, same objects in the same positions, same background, nothing else moves and nothing new appears in the frame.";
const IGUAL = "Same garage, same workbench, same objects in the same positions, same clothing, same background, nothing appears or moves behind him.";

const M = [
  ["n001", IGUAL, "his forearms tense and the battery rises a couple of centimetres, nothing else changes"],
  ["n005", IGUAL_OBJ, "a hand enters from the right, closes around the phone and lifts it a little off the bench"],
  ["n007", IGUAL_OBJ, "a hand enters from the left and turns the battery a few degrees where it stands on the bench"],
  ["n017", IGUAL_OBJ, "a thumb enters the frame and rubs once across the corroded lead post, then stops"],
  ["n018", IGUAL_OBJ, "the fridge door swings open a few centimetres and stops"],
  ["n019", IGUAL_OBJ, "the hanging clamp meter swings once on its hook and slows to a stop"],
  ["n020", IGUAL_OBJ, "a hand enters from the right and sets a steel tape measure down on the bench beside the two batteries"],
  ["n022", IGUAL_OBJ, "a finger enters the frame and taps the phone screen once, then withdraws"],
];

const out = M.map(([id, change, motion]) => ({ nombre: `cmeciclo_${id}`, change, motion }));
const malos = out.filter((o) => /breath|respir|zoom|dolly|\bpan\b|jump cut|new scene/i.test(`${o.motion} ${o.change}`));
console.log(`re-roll ${out.length} · violaciones ${malos.length}`);
if (malos.length) process.exit(1);
fs.writeFileSync("_v3/cmeciclo_agnes_g0retry.json", JSON.stringify(out, null, 1));
console.log("→ _v3/cmeciclo_agnes_g0retry.json");
