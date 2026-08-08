// fetch_mask_hooks.mjs — descarga 3 FOTOS reales (Pexels) para los componentes del hook.
//   hook_spot_macro.jpg (macro de mancha en piel), hook_jar.jpg (romero), hook_cream.jpg (crema cara).
import fs from "fs";
import { pexelsPhoto, pixabayPhoto, usedRegistry } from "./stock_lib.mjs";

const WANT = [
  { name: "hook_spot_macro", q: "age spot on skin macro closeup" },
  { name: "hook_jar", q: "fresh rosemary bunch on wooden table" },
  { name: "hook_cream", q: "luxury white face cream jar" },
];
const outDir = "public/img";
fs.mkdirSync(outDir, { recursive: true });
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url);
      if (!r.ok) { await sleep(700); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 8000) { await sleep(500); continue; }
      fs.writeFileSync(dest, buf);
      return true;
    } catch { await sleep(800); }
  }
  return false;
}

for (const w of WANT) {
  const dest = `${outDir}/${w.name}.jpg`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) { console.log("skip", w.name); continue; }
  let hit = null;
  for (const fn of [pexelsPhoto, pixabayPhoto]) {
    try { hit = await fn(w.q, used); } catch { hit = null; }
    if (hit && hit.link) break;
  }
  if (!hit || !hit.link) { console.log("MISS", w.name, "|", w.q); continue; }
  const done = await dl(hit.link, dest);
  console.log(done ? "OK" : "FAIL", w.name, "|", w.q);
  await sleep(300);
}
console.log("hooks done");
