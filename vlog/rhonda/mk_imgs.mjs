// _v3/<slug>_shots.json → _v3/<slug>_imgs.json (lista de gptimg: bi sin ref · rh con el recorte de cara 128x192). SLUG=x node vlog/rhonda/mk_imgs.mjs
import { V3, J, W, SLUG } from "./env.mjs";
const { shots } = J(V3 + "shots.json"); const seen = new Set(), items = [];
for (const s of shots) {
  if (!["bi", "rh", "kf"].includes(s.kind) || seen.has(s.name)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); continue; }
  seen.add(s.name); items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "rh" ? { ref: `public/ref_${SLUG}_face.png` } : {}) });
}
W(V3 + "imgs.json", items); console.log(items.length, "imágenes ·", items.filter((i) => i.ref).length, "con Rhonda");
