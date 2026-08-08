// fetch_hair_stock.mjs — stock (Pexels→Pixabay→Archive) para la cama densa de rosemaryhair.
// Lee public/broll/shots_denseH.json [{name, query}] → public/broll/rosemaryhair/<name>.mp4 (aislado por slug).
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const items = JSON.parse(fs.readFileSync("public/broll/shots_denseH.json", "utf8").replace(/^﻿/, ""));
const outDir = "public/broll/rosemaryhair";
fs.mkdirSync(outDir, { recursive: true });
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(800); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 20000) { await sleep(600); continue; }
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(1000); }
  }
  return false;
}

let ok = 0, miss = 0;
const missList = [];
for (const b of items) {
  const dest = `${outDir}/${b.name}.mp4`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) { ok++; continue; }
  const q = b.query;
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) {
    try { hit = await fn(q, 5, used); } catch { hit = null; }
    if (hit && hit.link) break;
  }
  if (!hit || !hit.link) { console.log("MISS", b.name, "|", q); miss++; missList.push(b); continue; }
  const done = await dl(hit.link, dest);
  if (done) { ok++; if (hit.key) used.add(hit.key); console.log("OK", b.name, "|", q.slice(0, 40)); }
  else { console.log("DLFAIL", b.name); miss++; missList.push(b); }
  await sleep(200);
}
fs.writeFileSync("public/broll/hair_miss.json", JSON.stringify(missList, null, 1));
console.log(`\n=== stock rosemaryhair: ${ok} OK · ${miss} MISS de ${items.length} ===`);
