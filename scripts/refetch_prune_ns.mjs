// refetch_prune_ns.mjs — reintenta las queries que fallaron (alternativas más simples) y luego
// PODA src/_fed6/VideoEdit/nightserum_broll.ts a SOLO los clips que existen en disco
// (recalcula dur contigua al próximo clip existente). Evita 404 → frames negros.
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const outDir = "public/broll/nightserum";
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function dl(url, dest) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; } const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 20000) { await sleep(500); continue; } fs.writeFileSync(dest, buf); return true; } catch { await sleep(800); } } return false; }

// alternativas por query fallida
const ALT = {
  "luxury face cream jar close up": "cosmetic cream jar close up",
  "dropper bottle of facial oil": "facial serum dropper bottle",
  "full moon over a bedroom window": "full moon night sky",
  "woman sleeping peacefully at night": "woman sleeping in bed",
  "luxury cream jar with gold lid": "skincare cream jar white",
  "thick cream smeared on skin": "moisturizer cream on skin close up",
  "hand rubbing lotion into skin": "applying hand lotion",
  "greasy cream on the back of hand": "hand cream on back of hand",
  "cutting an aloe leaf on a kitchen board": "sliced aloe vera leaf",
};
let miss = [];
try { miss = JSON.parse(fs.readFileSync("public/broll/nightserum_miss.json", "utf8")); } catch {}
let rec = 0;
for (const b of miss) {
  const dest = `${outDir}/${b.name}.mp4`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) { rec++; continue; }
  const q = ALT[b.query] || b.query;
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 6, used); } catch { hit = null; } if (hit && hit.link) break; }
  if (hit && hit.link && await dl(hit.link, dest)) { rec++; if (hit.key) used.add(hit.key); console.log("REC", b.name, "|", q); }
  else console.log("STILL-MISS", b.name, "|", q);
  await sleep(250);
}

// PODA nightserum_broll.ts a clips existentes
const src = fs.readFileSync("src/_fed6/VideoEdit/nightserum_broll.ts", "utf8");
const arr = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("]") + 1));
const exists = arr.filter((b) => { const f = `public/${b.src}`; return fs.existsSync(f) && fs.statSync(f).size > 20000; });
const caps = JSON.parse(fs.readFileSync("public/captions_nightserum.json", "utf8").replace(/^﻿/, ""));
const CW = (caps.words || caps);
const VEND = ((CW[CW.length - 1].endMs || CW[CW.length - 1].startMs) / 1000) + 2;
for (let i = 0; i < exists.length; i++) exists[i].dur = +(((i + 1 < exists.length ? exists[i + 1].start : VEND) - exists[i].start)).toFixed(2);
fs.writeFileSync("src/_fed6/VideoEdit/nightserum_broll.ts",
  `// AUTO-GENERADO + PODADO (refetch_prune_ns) — b-roll denso Pexels, solo clips existentes.\n` +
  `export const NS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(exists)};\n`);
console.log(`\nrecuperados: ${rec}/${miss.length} · NS_BROLL podado: ${arr.length} → ${exists.length} clips existentes`);
