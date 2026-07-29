import fs from "node:fs";
import path from "node:path";
import {
  markUsed,
  pexelsPhoto,
  pixabayPhoto,
  usedRegistry,
} from "./stock_lib.mjs";

const slug = "v7ior5j7vkw9";
const failed = JSON.parse(
  fs.readFileSync(`_v3/${slug}_stock_failed.json`, "utf8"),
);
const outDir = `public/broll/${slug}`;
const queries = [
  "tomato plant vegetable garden",
  "gardener hands vegetable plants",
  "homegrown tomatoes garden",
  "raised bed tomato garden",
  "tomato leaves close up",
  "gardener inspecting tomato plants",
  "watering vegetable garden",
  "tomato harvest hands",
  "healthy tomato vines",
  "garden soil tomato plant",
  "container tomato plant",
  "summer vegetable garden",
];

fs.mkdirSync(outDir, { recursive: true });
const result = [];

for (let i = 0; i < failed.length; i++) {
  const f = failed[i];
  const { error: _previousError, ...base } = f;
  const dest = path.join(outDir, `${f.name}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    result.push({ ...base, file: `${f.name}.jpg`, skipped: true });
    continue;
  }

  let photo = null;
  let usedQuery = "";
  for (let k = 0; k < queries.length && !photo; k++) {
    usedQuery = queries[(i + k) % queries.length];
    photo =
      (await pexelsPhoto(usedQuery, usedRegistry()).catch(() => null)) ||
      (await pixabayPhoto(usedQuery, usedRegistry()).catch(() => null));
  }
  if (!photo) {
    result.push({ ...base, error: "sin fotografía real de stock" });
    continue;
  }

  const r = await fetch(photo.link, { signal: AbortSignal.timeout(120000) });
  if (!r.ok) {
    result.push({ ...base, error: `descarga ${r.status}` });
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  if (buf.length < 20000) {
    result.push({ ...base, error: "archivo demasiado pequeño" });
    continue;
  }
  markUsed(photo.key);
  result.push({
    ...base,
    file: `${f.name}.jpg`,
    provider: photo.src,
    usedQuery,
    bytes: buf.length,
  });
  console.log(`↓ foto real ${f.name}.jpg · ${photo.src} · ${usedQuery}`);
}

const errors = result.filter((r) => r.error);
fs.writeFileSync(
  `_v3/${slug}_stock_photo_results.json`,
  JSON.stringify(result, null, 2),
);
console.log(`LISTO fotos ${result.length - errors.length}/${failed.length}`);
if (errors.length) {
  console.log(errors.map((e) => `${e.name}: ${e.error}`).join("\n"));
  process.exitCode = 2;
}
