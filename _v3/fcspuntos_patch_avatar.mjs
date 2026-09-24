// Rellena el campo `clip` de los beats de avatar del plan con las ventanas cortadas.
import fs from "node:fs";
const P = "_v3/fcspuntos_plan.json";
const plan = JSON.parse(fs.readFileSync(P, "utf8"));
let n = 0, faltan = 0;
for (const b of plan.beats) {
  if (b.tipo !== "avatar") continue;
  const src = `broll/fcspuntos_av/win-${String(b.win).padStart(3, "0")}.mp4`;
  if (!fs.existsSync("public/" + src)) { faltan++; continue; }
  b.clip = src; n++;
}
fs.writeFileSync(P, JSON.stringify(plan, null, 1));
console.log(`avatar beats parcheados ${n} · faltan ${faltan}`);
if (faltan) process.exit(1);
