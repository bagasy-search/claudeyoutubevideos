import fs from "node:fs";
import { SPEC } from "./spec.mjs";
import { FALLBACK } from "./batchB.mjs";
const MOT = {
  m006: "her fingertips press softly and start a tiny slow circle under the corners of her mouth", m007: "the two fingertips keep making tiny slow circles under her mouth corners, the skin moving with them",
  m008: "her flat fingers glide slowly upward from the mouth corners towards the cheekbones", m009: "her fingers slide lightly towards her ear and her eyes stay half closed",
  m010: "her closed-lips smile lifts slowly against the fingertips and then relaxes a little", m012: "her lips move gently forward into the soft kiss and hold it",
  m013: "the kiss slowly turns into a closed-lips smile, cheeks rising", m014: "she stays upright, the muscles under her chin firm up slightly, she blinks once",
  m015: "a small water droplet slides slowly down the porcelain next to the timer, daylight shifts softly on the tiles",
  m039: "she stays frozen with the spoon in the air, eyebrows lifting a little more", m041: "her fingertip touches the drooping corner of her mouth and she tilts her head slightly",
  m042: "the puppet sways very slightly on its strings", m045: "she slowly lowers the photo and looks at it with a sigh-less still face, blinking",
  m107: "the pressed fingertips make a small slow circle below the mouth corner", m109: "the fingertips continue slow circles while her eyes glance at the timer",
  m110: "her jaw loosens a few millimetres more and her shoulders drop", m111: "a small surprised smile grows as her fingers keep circling",
  m117: "the three fingers drag the cheek skin slowly downward", m123: "three flat fingers slide slowly towards her ear", m124: "her lifted fingers travel back through the air towards her mouth without touching the skin",
  m127: "she laughs softly at her reflection, hand covering her mouth", m130: "the index fingertips rest still while the lips relax", m131: "the smile rises slowly against the fingertips",
  m133: "her gentle smile widens a little, fingers barely touching", m139: "the strained smile trembles, jaw clenched harder", m144: "her lips push softly forward into the kiss",
  m145: "the kiss turns slowly into a closed-lips smile", m148: "the pushed-forward lips tremble slightly with effort", m151: "she lifts one finger as she remembers something, the TV light flickers gently",
  m152: "her hand stays on her jaw and her eyes widen in surprise", m159: "she keeps her lips closed and blinks slowly", m163: "she lengthens her neck slightly upward",
  m165: "her fingers rest under her chin and she nods very slightly", m188: "she gently presses the towel against her cheek and lifts it away",
  m190: "her jaw clenches harder and the lips tighten", m193: "her jaw goes slack and her shoulders relax", m195: "her fingertips press and rub quickly on her cheeks",
  m196: "the light shifts very slightly across the reddened skin", m212: "the wife leans towards him in alarm", m213: "the daughter tightens her grip on her mother's arm",
  m214: "his right arm drifts slowly down while the left stays up", m236: "she gives a soft almost-smile at her reflection", m238: "she smiles slightly while watching TV",
  m241: "the granddaughter smiles and leans closer", m242: "she laughs softly with a hand on her chest", m260: "she taps the phone screen to take the selfie", m277: "she smiles warmly and tilts her head a little",
};
const list = [];
for (const [n, s] of Object.entries(SPEC)) {
  const conGente = ["R", "P", "RP"].includes(s.t) || (s.t === "G" && /woman|man|hand/i.test(s.p || ""));
  const fb = s.t === "S" && (FALLBACK[s.q] || ["m080", "m082", "m102", "m199"].includes(n));
  if (!["R", "P", "RP", "G"].includes(s.t) && !fb) continue;
  const motion = MOT[n] || (conGente || fb ? "a small natural movement of the hands and a slow blink, the person keeps the same pose" : "the daylight shifts very softly across the scene");
  list.push({ nombre: n, motion, ...(s.t === "P" || s.t === "RP" ? { pres: true } : conGente || fb ? { person: true } : {}) });
}
fs.writeFileSync("_v3/famarioneta_i2v.json", JSON.stringify(list, null, 1));
console.log(list.length);
