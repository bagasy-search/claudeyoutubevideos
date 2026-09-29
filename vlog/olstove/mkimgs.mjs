// items.json de gpt-image-2 (Batch) para las tomas bi/ole del DIRECTOR; copia los anclajes de detalle del minuto 1. node vlog/olstove/mkimgs.mjs
import fs from "node:fs";
import { SHOTS } from "./dir.mjs";
const R = "D:/Proyectos/video2-wt/olstove/";
const items = [], anim = [];
fs.mkdirSync(R + "public/img/olstove", { recursive: true });
for (const s of SHOTS) {
  if (!["bi", "ole"].includes(s.kind)) continue;
  if (s.src) { fs.copyFileSync(R + `vlog/olstove/M1/anc/${s.src}.png`, R + `public/img/olstove/${s.name}.png`); }
  else if (!fs.existsSync(R + `public/img/olstove/${s.name}.png`) && !items.some((i) => i.name === s.name)) items.push(s.kind === "ole" ? { name: s.name, prompt: s.prompt, ref: "public/ref_olstove_face.png" } : { name: s.name, prompt: s.prompt });
  if (s.anim) anim.push({ nombre: s.name, motion: s.anim });
}
fs.writeFileSync(R + "vlog/olstove/imgs_items.json", JSON.stringify(items, null, 1));
fs.writeFileSync(R + "vlog/olstove/anim_items.json", JSON.stringify(anim, null, 1));
console.log("imágenes por generar:", items.length, "· con animación v2.0:", anim.length);
