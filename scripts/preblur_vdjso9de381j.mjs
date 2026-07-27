// preblur_vdjso9de381j.mjs — genera los `<imagen>_blur.jpg` que FocusCards deriva con blurOf()
// y ESPERA que ya existan (no los genera él). Sin esto → 404 y el chunk MUERE.
import fs from "fs";
import { execFileSync } from "child_process";

const SLUG = "vdjso9de381j";
const beats = JSON.parse(fs.readFileSync(`beatsheet/${SLUG}.json`, "utf8")).beats;
const need = new Set();
for (const b of beats) {
  if (b.kind !== "focuscards") continue;
  for (const it of b.items || []) if (it.image) need.add(it.image);
}
console.log(`focuscards: ${need.size} imágenes necesitan blur`);
let ok = 0, miss = [];
for (const img of need) {
  const cand = ["png", "jpg", "jpeg", "webp"].map((e) => `public/${img}.${e}`).find((p) => fs.existsSync(p))
    || (fs.existsSync(`public/${img}`) ? `public/${img}` : null);
  if (!cand) { miss.push(img); continue; }
  const out = `public/${img.replace(/\.(png|jpg|jpeg|webp)$/i, "")}_blur.jpg`;
  if (fs.existsSync(out)) { ok++; continue; }
  try {
    execFileSync("ffmpeg", ["-y", "-i", cand, "-vf", "gblur=sigma=22", "-q:v", "4", out], { stdio: "ignore" });
    ok++;
  } catch (e) { miss.push(img); }
}
console.log(`blur listos: ${ok} · faltan: ${miss.length}`, miss);
if (miss.length) process.exit(1);
