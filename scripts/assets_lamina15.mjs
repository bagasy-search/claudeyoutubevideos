// assets_lamina15.mjs — arma _lamina15_assets.txt LEYENDO los cues YA generados.
// ⚠️ Corre SIEMPRE DESPUÉS de build+beatsheet+rewire. Si se corre antes, la lista
// describe el build ANTERIOR: pasó exactamente eso — al sacar un clip de un momento
// y devolverlo a su foto, la foto no entró al tarball y el runner murió con
// "The source image cannot be decoded" (el archivo no existía en la nube).
import fs from "node:fs";
const cues = fs.readFileSync("src/VideoEdit/cues_lamina15.gen.tsx", "utf8");
const h3 = fs.existsSync("src/VideoEdit/h3audio_lamina15.gen.ts") ? fs.readFileSync("src/VideoEdit/h3audio_lamina15.gen.ts", "utf8") : "";
const refs = [...new Set([...(cues + h3).matchAll(/"((?:img|broll|vid)\/[^"]+)"/g)].map((m) => m[1]))];
const out = new Set(); const miss = [];
for (const r of refs) {
  if (!fs.existsSync("public/" + r)) { miss.push(r); continue; }
  out.add(r);
  // el _blur.jpg lo DERIVA el kit en runtime: nunca aparece en los cues y por eso
  // se olvidaba, con 404 y los 20 chunks caídos juntos
  if (/^img\//.test(r)) { const b = r.replace(/\.[^.]+$/, "") + "_blur.jpg"; if (fs.existsSync("public/" + b)) out.add(b); else miss.push(b); }
}
const list = [...out].sort();
fs.writeFileSync("_lamina15_assets.txt", list.join("\n") + "\n", "utf8");
let tot = 0; for (const f of list) tot += fs.statSync("public/" + f).size;
tot += fs.statSync("public/lamina15_opt.mp4").size + fs.statSync("public/lamina15.wav").size;
console.log(`assets ${list.length} · faltantes ${miss.length} · tarball ~${(tot / 1048576).toFixed(0)} MB`);
if (miss.length) { console.error("⛔ FALTAN:", miss.slice(0, 10).join(", ")); process.exit(1); }
