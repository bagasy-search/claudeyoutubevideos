// imgs.mjs <slug> — arma D:/rtmp/<slug>/imgs.json (para scripts/gptimg.mjs) a partir de prompts.json. gpt/old → /generations; rosa → /edits con la cara 128x192.
import fs from "node:fs";
const slug = process.argv[2], R = `D:/rtmp/${slug}/`;
const F = "C:/Users/bauti/Downloads/video2/_v3/abuela_ref/abuela_face_128.png";
const p = JSON.parse(fs.readFileSync(R + "prompts.json", "utf8"));
const items = [];
for (const x of p) {
  if (x.kind === "gpt" || x.kind === "old") items.push({ name: `a_${x.i}`, prompt: x.prompt });
  else if (x.kind === "rosa") items.push({ name: `a_${x.i}`, prompt: x.prompt, ref: F });
}
fs.writeFileSync(R + "imgs.json", JSON.stringify(items, null, 1));
console.log("imágenes a generar:", items.length);
