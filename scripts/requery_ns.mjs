// requery_ns.mjs — para los clips marcados off-topic, reintenta con queries MÁS SIMPLES
// (Pexels rinde mejor con sustantivos simples). Lee verdicts, mapea por tema, re-descarga
// el .mp4 con un resultado FRESCO (used registry), y actualiza la query en nightserum_broll.ts.
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const VERD = "D:/rtmp/tmp/claude/C--Users-bauti-Downloads/796d3c21-c458-46e9-b909-92cdb29dd9fe/scratchpad/ns_sheet/verdicts.json";
const verdicts = JSON.parse(fs.readFileSync(VERD, "utf8"));
const badNames = new Set(verdicts.filter((v) => !v.ok).map((v) => v.name));

const src = fs.readFileSync("src/_fed6/VideoEdit/nightserum_broll.ts", "utf8");
const arr = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("]") + 1));

// tema (por substring de la query original) → lista de queries SIMPLES a probar en orden
const RULES = [
  [/rosemary.*oil|oil.*rosemary|dropper|facial oil|straining/, ["rosemary oil", "essential oil bottle", "herbal oil", "olive oil pouring"]],
  [/rosemary/, ["rosemary", "fresh rosemary", "rosemary plant", "rosemary herb"]],
  [/aloe/, ["aloe vera", "aloe vera plant", "aloe vera gel", "aloe leaf"]],
  [/crepey|back of hand|neck skin|decolletage|mature.*skin|healthy mature/, ["wrinkled hands", "elderly hands", "old woman hands", "senior skin close up"]],
  [/looking at her hands|grandmother|grandchild/, ["elderly hands", "senior woman hands", "old person hands"]],
  [/grape|raisin/, ["grapes", "bunch of grapes", "raisins", "green grapes"]],
  [/doctor/, ["senior woman doctor", "elderly patient doctor", "doctor talking patient"]],
  [/cream jar|cosmetic cream|store shelf|luxury cream/, ["face cream jar", "cosmetic products", "skincare cream", "cream jar white"]],
  [/moon|bedroom|sleeping|night skincare/, ["night sky moon", "woman sleeping", "bedroom at night", "moon window"]],
  [/lotion|greasy cream|thick cream|applying oil|applying.*cream/, ["applying face cream", "woman applying cream", "moisturizing skin", "skincare routine"]],
  [/cloth|nightstand/, ["cloth and bottle", "skincare bottle table", "cotton cloth"]],
  [/flat lay|on counter|holding aloe|bathroom counter|kitchen counter/, ["aloe vera plant", "aloe vera leaf", "herbs on table"]],
  [/water drop|absorbing|gel texture/, ["water drops macro", "gel texture", "clear gel"]],
];
const simplesFor = (q) => { for (const [re, list] of RULES) if (re.test(q)) return list; return [q]; };

const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function dl(url, dest) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; } const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 20000) { await sleep(500); continue; } fs.writeFileSync(dest, buf); return true; } catch { await sleep(800); } } return false; }

let fixed = 0;
for (const b of arr) {
  if (!badNames.has(b.name)) continue;
  const dest = `public/${b.src}`;
  const tries = simplesFor(b.query);
  let done = false;
  for (const q of tries) {
    let hit = null;
    for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 8, used); } catch { hit = null; } if (hit && hit.link) break; }
    if (hit && hit.link && await dl(hit.link, dest)) { if (hit.key) used.add(hit.key); b.query = q; fixed++; done = true; console.log("RE", b.name, "→", q); break; }
    await sleep(150);
  }
  if (!done) console.log("KEEP-OLD", b.name, "|", b.query);
}
fs.writeFileSync("src/_fed6/VideoEdit/nightserum_broll.ts",
  `// AUTO-GENERADO + REQUERY simple (requery_ns) — b-roll Pexels.\n` +
  `export const NS_BROLL: { name: string; src: string; start: number; dur: number; query: string }[] = ${JSON.stringify(arr)};\n`);
console.log(`\nre-descargados: ${fixed}/${badNames.size}`);
