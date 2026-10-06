// vlog/beforeus/i2v.mjs <slug> — lista de animación agnes (v2.0 mudo, 2 s a 0,5×) para el canal Before Us.
// Lee D:/rtmp/<slug>/prompts_all.json y escribe _v3/<slug>_i2v.json para scripts/agnes_i2v.mjs.
// Movimiento LEVE y de los hombros para arriba en personas (nunca respirar); en planos sin gente, voz de objeto.
// Planos sin nada que se mueva (objeto quieto de museo, lab) quedan en foto con Ken-Burns: no se animan.
import fs from "node:fs";
const SLUG = process.argv[2];
const R = `D:/rtmp/${SLUG}/`;
const PR = JSON.parse(fs.readFileSync(R + "prompts_all.json", "utf8"));
const PERSON = [
  "a single slow blink and the smallest tilt of the head; the shoulders do not move",
  "the eyes move to something off to the side and come back; the same posture throughout",
  "the jaw shifts a little and one eyebrow moves; nothing below the neck moves at all",
  "the fingers already resting adjust their grip by a millimetre and there is one blink; nothing else moves",
  "the head turns a few degrees toward the light and stops; the body stays still",
];
const OBJ = [
  [/\b(fire|flame|embers?|hearth|campfire|torch)\b/i, "the flames flicker and a few sparks drift upward; everything else stays still"],
  [/\b(river|stream|water|pool|rain)\b/i, "the water keeps flowing gently; everything else stays still"],
  [/\b(leaves|forest|beech|oak|trees|grass|bush|flowers?|reeds|cattail|fern)\b/i, "a light breeze stirs the leaves a little; nothing else moves"],
  [/\b(snow|blizzard|ice)\b/i, "fine snow blows across the surface; nothing else moves"],
  [/\b(steam|smoke|bubbl)/i, "thin steam rises and drifts; nothing else moves"],
  [/\b(chimpanzee|macaws?|parrots?|rat|bees?|antelope|beetle|gorilla)\b/i, "the animal moves its head a little; the rest of the scene stays still"],
];
const people = (p) => p.kind === "cast" || p.kind === "now" || (p.kind === "scene" && !/\b(cave|shelter|landscape|forest)\b/.test(p.subject.split(" ").slice(0, 6).join(" ")));
const out = [];
let k = 0, k2 = 0;
for (const p of PR) {
  const n = `ah_${String(p.i).padStart(3, "0")}_${p.part}`;
  if (people(p)) {
    const fire = /\b(fire|flame|embers?|hearth)\b/i.test(p.subject) ? " The firelight flickers on the faces." : "";
    out.push({ nombre: n, motion: PERSON[k++ % PERSON.length] + "." + fire, person: true });
  } else {
    const m = OBJ.find(([re]) => re.test(p.subject));
    if (m) { const alt = (k2++ % 2) ? m[1].replace("; ", ", very slowly; ") : m[1]; out.push({ nombre: n, motion: alt + "." }); }
  }
}
fs.mkdirSync("_v3", { recursive: true });
fs.writeFileSync(`_v3/${SLUG}_i2v.json`, JSON.stringify(out, null, 1));
console.log(`MEDIDO: ${out.length} clips a animar de ${PR.length} planos (${out.filter((x) => x.person).length} con personas)`);
process.exit(out.length ? 0 : 2);
