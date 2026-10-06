// _v3/<slug>_shots.json (+ vlog/<slug>/imgs_extra.json) → _v3/<slug>_imgs.json (lista de gptimg: bi/kf sin ref · cl con el recorte
// de cara 128x192). Extras = imágenes que usan los componentes (antes/después, camas de los 3D) y no son tomas. SLUG=x node vlog/claudio/mk_imgs.mjs
import fs from "node:fs";
import { R, V3, J, W, SLUG } from "./env.mjs";
import { BI } from "./lib.mjs";
const { shots } = J(V3 + "shots.json"); const seen = new Set(), items = [];
for (const s of shots) {
  if (!["bi", "cl", "kf"].includes(s.kind) || seen.has(s.name)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); continue; }
  seen.add(s.name); items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "cl" ? { ref: `public/ref_${SLUG}_face.png` } : {}) });
}
const EX = R + `vlog/${SLUG}/imgs_extra.json`;
if (fs.existsSync(EX)) for (const e of J(EX)) if (!seen.has(e.name)) { seen.add(e.name); items.push({ name: e.name, prompt: e.raw ? e.prompt : BI(e.prompt), ...(e.ref ? { ref: `public/ref_${SLUG}_face.png` } : {}) }); }
W(V3 + "imgs.json", items); console.log(items.length, "imágenes ·", items.filter((i) => i.ref).length, "con Claudio");
