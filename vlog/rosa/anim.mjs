// anim.mjs <slug> — arma la lista de clips agnes (modelo VIEJO v2.0, 2 s a 0,5× = 4 s) para los planos que se animan.
// Salida: D:/rtmp/<slug>/i2v.json  →  node scripts/agnes_i2v.mjs D:/rtmp/<slug>/i2v.json <slug> D:/rtmp/<slug>/img public/broll/<slug>
//         seguido de  node scripts/agnes_qc.mjs <slug> --fix   (sin ese sello el farm no rendea los clips)
// Reglas: movimiento SIMPLÍSIMO y leve; personas sólo de los hombros para arriba y SIN respirar (menú breath-free); objetos en voz de objeto.
import fs from "node:fs";
import { norm } from "./lib.mjs";
const slug = process.argv[2];
const R = `D:/rtmp/${slug}/`;
const prompts = JSON.parse(fs.readFileSync(R + "prompts.json", "utf8"));
const ROSA = [
  "she blinks once, slowly, and her gaze shifts a few degrees to one side; the rest of her is motionless",
  "her jaw shifts a little as she thinks and one eyebrow moves; nothing below the neck moves at all",
  "a single slow blink and the smallest tilt of the head; the shoulders do not move",
  "her eyes move to something off to the side and come back; she holds the same posture throughout",
  "the fingers already resting adjust their grip by a millimetre and she blinks; nothing else moves",
];
const OBJ = [
  [/sopa|caldo|olla|guiso|lentej|frijol|garbanzo|puchero|arroz|polenta|sopa/, "thin steam rises slowly from the pot and drifts upward; the surface of the food trembles very slightly"],
  [/cebolla|ajo|sarten|dorar|aceite/, "the onion slices sizzle gently and shift very slightly in the hot oil"],
  [/bpanb|migas|tostad/, "a small crumb slides a little along the board; nothing else moves"],
  [/bhuevo/, "the egg yolk trembles very slightly; a faint wisp of steam rises"],
  [/bteb|taza/, "a thin wisp of steam curls up from the cup"],
  [/ventana|cortina|planta/, "the lace curtain moves gently in a light breeze; nothing else moves"],
  [/frasco|libreta|cuaderno|mesa|despensa/, "the light on the table shifts very slightly as a cloud passes; nothing else moves"],
];
const list = [];
let rn = 0;
for (const p of prompts) {
  if (p.kind === "web" || fs.existsSync(R + `webv/v_${p.i}.mp4`)) continue;
  const hook = p.i < 30;
  const pick = hook || p.kind === "rosa" || p.i % 2 === 0;
  if (!pick) continue;
  const t = norm(p.text + " " + p.query);
  if (p.kind === "rosa") list.push({ nombre: `a_${p.i}`, motion: ROSA[rn++ % ROSA.length], pres: true });
  else if (p.kind === "old") list.push({ nombre: `a_${p.i}`, motion: "a child in the group blinks and the steam over the pot drifts upward; everything else stays still", gente: true });
  else {
    const o = OBJ.find((x) => x[0].test(t));
    list.push({ nombre: `a_${p.i}`, motion: o ? o[1] : "a thin wisp of steam rises slowly from the food; nothing else moves" });
  }
}
fs.writeFileSync(R + "i2v.json", JSON.stringify(list, null, 1));
console.log("clips a animar:", list.length, "de", prompts.filter((p) => p.kind !== "web").length, "imágenes");
