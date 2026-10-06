// Listas de agnes i2v desde las tomas del DIRECTOR:
//   _v3/<slug>_kf.json   detalles kf del minuto 1 → agnes-video-2.5-flash (4 s, foley nativo, sin ralentí) → public/vid/<slug>/
//   _v3/<slug>_i2v.json  fotos bi con `anim` que NO tienen stock real → agnes-video-v2.0 (2 s → ralentí 0,5 = 4 s) → public/broll/<slug>/
// SLUG=x node vlog/claudio/mk_i2v.mjs
import fs from "node:fs";
import { R, SLUG, V3, J, W } from "./env.mjs";
const { shots } = J(V3 + "shots.json"), seen = new Set();
const HANDS = /\b(hand|hands|glove|gloved|finger|fingers|woman|man|she|he|her|his|couple|people|homeowner|plumber)\b/i;
const kf = [], i2v = [];
for (const s of shots) {
  if (seen.has(s.name)) continue; seen.add(s.name);
  if (s.kind === "kf") kf.push({ nombre: s.name, motion: s.d2, change: `It starts exactly as the picture: ${s.d1}.`, sonido: s.sound, gente: HANDS.test(s.prompt + " " + s.d1) });
  if (s.kind === "bi" && s.anim && !fs.existsSync(R + `public/broll/${SLUG}_st/${s.name}.mp4`)) i2v.push({ nombre: s.name, motion: s.anim, gente: HANDS.test(s.prompt.split(" One ordinary frame")[0] + " " + s.anim) });
}
W(V3 + "kf.json", kf); W(V3 + "i2v.json", i2v);
console.log("kf 2.5-flash:", kf.length, "· i2v v2.0:", i2v.length, "(con gente", i2v.filter((x) => x.gente).length + ")");
