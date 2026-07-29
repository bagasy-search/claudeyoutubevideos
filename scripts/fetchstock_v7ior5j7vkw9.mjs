import fs from "node:fs";
import path from "node:path";
import { acquireStock } from "./stock_lib.mjs";

const slug = "v7ior5j7vkw9";
const shotsPath = `public/broll/shots_dense_${slug}.json`;
const mapPath = `_v3/${slug}_broll_map.json`;
const outDir = `public/broll/${slug}`;
const shots = JSON.parse(fs.readFileSync(shotsPath, "utf8"));
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const byName = new Map(map.map((m) => [path.basename(m.file, ".mp4"), m]));

fs.mkdirSync(outDir, { recursive: true });
const results = [];
let ok = 0;
let failed = 0;

for (let i = 0; i < shots.length; i++) {
  const shot = shots[i];
  const dest = path.join(outDir, `${shot.name}.mp4`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    ok++;
    results.push({ ...shot, file: `${shot.name}.mp4`, skipped: true });
    continue;
  }
  const meta = byName.get(shot.name);
  const got = await acquireStock(
    {
      name: shot.name,
      concept: shot.query,
      query: shot.query,
      dur: meta?.dur || 5,
    },
    outDir,
  );
  if (got && fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    ok++;
    results.push({ ...shot, file: `${shot.name}.mp4`, provider: got.src });
  } else {
    failed++;
    results.push({ ...shot, error: "sin stock limpio" });
  }
  if ((i + 1) % 10 === 0 || i === shots.length - 1) {
    console.log(`[${i + 1}/${shots.length}] ok=${ok} fallos=${failed}`);
  }
}

fs.writeFileSync(
  path.join(outDir, "broll_index.json"),
  JSON.stringify(results, null, 2),
);
fs.writeFileSync(
  `_v3/${slug}_stock_failed.json`,
  JSON.stringify(results.filter((r) => r.error), null, 2),
);
console.log(`LISTO ${ok}/${shots.length} · fallos ${failed}`);
if (failed > 0) process.exitCode = 2;
