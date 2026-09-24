// _prep_clipaudit.mjs — saca un frame del MEDIO de cada clip usado en el beatsheet y arma el
// manifiesto para scripts/imgaudit_vision.mjs (la auditoría corre por API, fuera del contexto).
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const SLUG = "fedcolageno";
const BEATS = JSON.parse(fs.readFileSync(`_v3/${SLUG}_beats.json`, "utf8"));
const USED = new Set(JSON.parse(fs.readFileSync(`_${SLUG}_need.json`, "utf8"))
  .filter((p) => p.startsWith("broll/")).map((p) => p.replace(`broll/${SLUG}_`, "").replace(".mp4", "")));

const OUT = `_clipstills_${SLUG}`;
fs.mkdirSync(OUT, { recursive: true });
const man = [];
for (const b of BEATS) {
  if (b.engine !== "agnes_video" || !USED.has(b.name)) continue;
  const src = `public/broll/${SLUG}_${b.name}.mp4`;
  if (!fs.existsSync(src)) continue;
  const dst = `${OUT}/${b.name}.jpg`;
  if (!fs.existsSync(dst)) {
    spawnSync("ffmpeg", ["-y", "-v", "error", "-ss", "2", "-i", src, "-frames:v", "1", "-vf", "scale=640:-2", dst]);
  }
  if (fs.existsSync(dst)) man.push({ name: b.name, path: dst, phrase: b.anchor });
}
const chunks = [];
for (let i = 0; i < man.length; i += 130) chunks.push(man.slice(i, i + 130));
chunks.forEach((c, i) => fs.writeFileSync(`_v3/clipaudit_${i + 1}.json`, JSON.stringify(c, null, 1)));
console.log(`stills ${man.length} · manifiestos ${chunks.length} (_v3/clipaudit_1..${chunks.length}.json)`);
