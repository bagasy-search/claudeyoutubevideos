// Lista de imágenes gpt-image-2 a generar (bi + ole + swaps de stock que faltan) → _v3/olpots_imgs.json ; node vlog/olpots/mk_imgs.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olpots/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olpots_shots.json", "utf8"));
const ex = (n) => fs.existsSync(R + `public/img/olpots/${n}.jpg`) || fs.existsSync(R + `out/imgs_raw/${n}.png`);
const items = [];
for (const s of shots) {
  if ((s.kind === "bi" || s.kind === "ole" || s.kind === "swap") && s.prompt && !ex(s.name)) {
    items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "ole" ? { ref: "public/ref_olpots_face.png" } : {}) });
  }
}
fs.writeFileSync(R + "_v3/olpots_imgs.json", JSON.stringify(items, null, 1));
console.log("imágenes por generar:", items.length, "(con cara:", items.filter((i) => i.ref).length + ")");
