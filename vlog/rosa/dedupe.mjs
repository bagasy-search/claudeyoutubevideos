// dedupe.mjs <slug> — Pexels devuelve la MISMA foto para consultas parecidas: deja la 1ª y degrada las repetidas a kind=gpt (md5 del original). Reescribe prompts.json e imgs.json.
import fs from "node:fs"; import crypto from "node:crypto"; import { spawnSync } from "node:child_process";
const slug = process.argv[2], R = `D:/rtmp/${slug}/`;
const p = JSON.parse(fs.readFileSync(R + "prompts.json", "utf8"));
const seen = new Map(); let dup = 0;
for (const x of p) {
  if (x.kind !== "web") continue;
  const raw = `${R}web/_sheets/${x.i}_raw.jpg`, f = `${R}web/w_${x.i}.jpg`;
  const src = fs.existsSync(raw) ? raw : f; if (!fs.existsSync(src)) continue;
  const h = crypto.createHash("md5").update(fs.readFileSync(src)).digest("hex");
  if (seen.has(h)) { x.kind = "gpt"; dup++; } else seen.set(h, x.i);
}
fs.writeFileSync(R + "prompts.json", JSON.stringify(p, null, 1));
console.log("web:", p.filter((x) => x.kind === "web").length, "· duplicadas degradadas a gpt:", dup);
spawnSync("node", [new URL("./imgs.mjs", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"), slug], { stdio: "inherit" });
