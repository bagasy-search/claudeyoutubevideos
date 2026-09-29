// DIRECTOR → listas para (1) gptimg.mjs (fotos bi, sin ref) y (2) agnes_i2v.mjs (animación v2.0 de las que tienen `anim`).
// node vlog/olcabin/mk_items.mjs  → vlog/olcabin/imgs_items.json · vlog/olcabin/anim_items.json
import fs from "node:fs";
import { SHOTS } from "./dir.mjs";
const items = [], anim = [], seen = new Set();
for (const s of SHOTS) {
  if (s.kind !== "bi" || !s.prompt || seen.has(s.name)) continue;
  seen.add(s.name); items.push({ name: s.name, prompt: s.prompt });
  if (s.anim) anim.push({ nombre: s.name, motion: s.anim, ...(s.hands ? { gente: true } : {}) });
}
fs.writeFileSync("vlog/olcabin/imgs_items.json", JSON.stringify(items, null, 1));
fs.writeFileSync("vlog/olcabin/anim_items.json", JSON.stringify(anim, null, 1));
console.log("imágenes", items.length, "· animaciones v2.0", anim.length);
