// _v3/<slug>_shots.json → DOS listas (regla 8-oct): _v3/<slug>_imgs_ag.json (SIN cara: bi/kf → agnes_img_pro GRATIS, prompt = sólo
// la escena) · _v3/<slug>_imgs_rh.json (CON la cara de Rhonda: rh → gptimg /edits low Batch, recorte 128x192). Tope 40 con cara.
// SLUG=x node vlog/rhonda/mk_imgs.mjs
import { V3, J, W, SLUG } from "./env.mjs";
const { shots, extra = [] } = J(V3 + "shots.json"); const seen = new Set(), ag = [], rh = [];
for (const s of [...shots, ...extra]) {
  if (!["bi", "rh", "kf"].includes(s.kind) || seen.has(s.name)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); continue; }
  seen.add(s.name);
  if (s.kind === "rh") rh.push({ name: s.name, prompt: s.prompt, ref: `public/ref_${SLUG}_face.png` });
  else ag.push({ name: s.name, prompt: s.prompt + (/label|bottle|box|jug/.test(s.prompt) ? " Any label is plain blank white with no writing." : "") });
}
W(V3 + "imgs_ag.json", ag); W(V3 + "imgs_rh.json", rh);
console.log(ag.length, "agnes sin cara ·", rh.length, "gpt con Rhonda", rh.length > 40 ? "⛔ >40" : "");
