// arma la lista EXPLÍCITA de assets del tarball del farm para vd5n5s9bhk4q.
// ⚠️ public/sfx VA SIEMPRE: el kit _fed6 referencia sfx_trans*.mp3 / sfx_whoosh_soft.mp3 y sin
// esos archivos cada chunk muere con 404 y el matrix CANCELA el render entero (gotcha jul 2026).
import fs from "fs";
const slug = "vd5n5s9bhk4q";
const items = [`${slug}.wav`, `${slug}_opt.mp4`];
if (!fs.existsSync("public/sfx")) throw new Error("falta public/sfx — el render se va a cancelar");
items.push("sfx");
for (const f of fs.readdirSync("public/img")) {
  if (f.startsWith(`p_${slug}`) || f.startsWith(`dg_${slug}`)) items.push(`img/${f}`);
}
items.push(`broll/${slug}`);
fs.writeFileSync(`_assets_${slug}_list.txt`, items.join("\n") + "\n");
console.log(`entradas: ${items.length} · sfx incluido: ${items.includes("sfx")} · sfx en disco: ${fs.readdirSync("public/sfx").length}`);
