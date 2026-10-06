// One-off: fetch 5 beautiful real crop photos for the CropReel3D hero component.
import fs from "node:fs";
import path from "node:path";
import { pexelsPhoto, pixabayPhoto } from "./stock_lib.mjs";

const OUT = "public/broll/cultivosep";
fs.mkdirSync(OUT, { recursive: true });

// crop key -> ordered queries (best first). Pick clean, close, appetizing shots.
const CROPS = [
  { name: "reel_kale", q: ["curly kale plant garden", "kale leaves close up", "kale vegetable"] },
  { name: "reel_acelga", q: ["swiss chard rainbow", "chard leaves garden", "swiss chard plant"] },
  { name: "reel_zanahoria", q: ["freshly harvested carrots soil", "bunch of carrots", "carrots garden harvest"] },
  { name: "reel_puerro", q: ["leeks harvest", "fresh leeks bunch", "leek vegetable garden"] },
  { name: "reel_ajo", q: ["garlic bulbs rustic", "garlic heads on wood", "fresh garlic harvest"] },
];

async function dl(url, dest) {
  const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error("http " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

for (const c of CROPS) {
  const dest = path.join(OUT, c.name + ".jpg");
  if (fs.existsSync(dest) && fs.statSync(dest).size > 60000) { console.log("skip", c.name); continue; }
  let got = null;
  for (const q of c.q) {
    const r = (await pexelsPhoto(q).catch(() => null)) || (await pixabayPhoto(q).catch(() => null));
    if (r?.link) { got = r; console.log(c.name, "<-", q, r.src); break; }
  }
  if (!got) { console.error("NO PHOTO for", c.name); continue; }
  try { const n = await dl(got.link, dest); console.log("  saved", c.name, (n / 1024 | 0) + "KB"); }
  catch (e) { console.error("  dl fail", c.name, e.message); }
}
console.log("done");
