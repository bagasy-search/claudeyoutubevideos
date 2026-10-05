// _v3/lorham_shots.json → lista de gptimg (bi/ei sin ref · lor con el crop de cara 128x192). node vlog/lorham/mk_imgs.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/lorham/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/lorham_shots.json", "utf8"));
const seen = new Set(), items = [];
for (const s of shots) {
  if (!["bi", "ei", "lor"].includes(s.kind) || seen.has(s.name)) continue;
  if (!s.prompt) { console.error("sin prompt:", s.name); continue; }
  seen.add(s.name);
  items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "lor" ? { ref: "public/ref_lorham_face.png" } : {}) });
}
fs.writeFileSync(R + "_v3/lorham_imgs.json", JSON.stringify(items, null, 1));
console.log(items.length, "imágenes ·", items.filter((i) => i.ref).length, "con Loretta");
