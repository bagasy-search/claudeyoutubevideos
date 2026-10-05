// _v3/<slug>_shots.json → _v3/<slug>_imgs.json (lista de gptimg: bi/ei sin ref · lor con el recorte de cara). SLUG=x node vlog/loretta/mk_imgs.mjs
import { V3, J, W } from "./env.mjs";
const { shots } = J(V3 + "shots.json"); const seen = new Set(), items = [];
for (const s of shots) {
  if (!["bi", "ei", "lor"].includes(s.kind) || seen.has(s.name)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); continue; }
  seen.add(s.name); items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "lor" ? { ref: "public/ref_lor_face.png" } : {}) });
}
W(V3 + "imgs.json", items); console.log(items.length, "imágenes ·", items.filter((i) => i.ref).length, "con Loretta");
