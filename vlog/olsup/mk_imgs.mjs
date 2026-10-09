// Lista de imágenes gpt-image-2 a generar (bi + ole + swaps de stock que faltan) → _v3/olsup_imgs.json ; node vlog/olsup/mk_imgs.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/olsup/";
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olsup_shots.json", "utf8"));
const ex = (n) => fs.existsSync(R + `public/img/olsup/${n}.jpg`) || fs.existsSync(R + `out/imgs_raw/${n}.png`);
const items = [];
for (const s of shots) {
  if ((s.kind === "bi" || s.kind === "ole" || s.kind === "swap") && s.prompt && !ex(s.name)) {
    items.push({ name: s.name, prompt: s.prompt, ...(s.kind === "ole" ? { ref: "public/ref_olsup_face.png" } : {}) });
  }
}
// camas para tarjetas de héroes (imágenes de fondo)
for (const b of JSON.parse(fs.readFileSync(R + "vlog/olsup/beds.json", "utf8"))) if (!ex(b.name)) items.push(b);
fs.writeFileSync(R + "_v3/olsup_imgs.json", JSON.stringify(items, null, 1));
console.log("imágenes por generar:", items.length, "(con cara:", items.filter((i) => i.ref).length + ")");
