// requery_hs3.mjs — pase FINAL sobre los clips que siguen off-topic: queries ABUNDANTES/seguras que Pexels
// SÍ tiene (nicho escaso: manos ancianas/regaliz no existen bien → usar footage on-topic-adyacente abundante).
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const v1 = JSON.parse(fs.readFileSync("_hs_verdicts.json", "utf8"));
const v2 = JSON.parse(fs.readFileSync("_hs_verdicts2.json", "utf8"));
const okNow = new Set(v2.filter((x) => x.ok).map((x) => x.name));
const finalBad = v1.filter((x) => !x.ok).map((x) => x.name).filter((n) => !okNow.has(n));
const dense = JSON.parse(fs.readFileSync("public/broll/dense_thinnedH.json", "utf8"));
const qOf = Object.fromEntries(dense.map((d) => [d.name, d.query]));
const used = usedRegistry();
const outDir = "public/broll/handsage";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const POOLS = {
  root: ["dried herbs on a wooden board", "herbal tea in a glass cup", "natural herbs and spices flat lay", "green tea being poured", "loose tea leaves macro", "wooden spoon with dried herbs"],
  hands: ["hands close up on a table", "person moisturizing their hands", "hand skin detail macro", "hands holding a warm cup", "gentle hands close up", "senior person hands resting"],
  cream: ["face cream jar on a table", "woman applying face cream", "cosmetic cream flat lay", "skincare products on a table"],
  people: ["senior woman relaxing at home", "older woman drinking tea", "mature woman smiling portrait", "grandmother at home smiling"],
  lemon: ["fresh lemons on a table", "slicing a lemon close up"],
  sun: ["warm sunlight through a window", "morning light on a table"],
  night: ["woman sleeping in bed", "cozy bedroom at night"],
  sunscreen: ["applying lotion to hands", "sunscreen bottle on a table"],
  clock: ["clock close up ticking", "calendar on a wall"],
  close: ["older woman smiling in warm light", "peaceful senior woman at home"],
};
function pool(q) {
  const s = (q || "").toLowerCase();
  if (/licorice|root|herb|tea|ginger|apothecar/.test(s)) return "root";
  if (/hand|spot|wrinkl|skin|elderly|aging|liver/.test(s)) return "hands";
  if (/cream|serum|cosmetic|pharmacy|skincare/.test(s)) return "cream";
  if (/lemon/.test(s)) return "lemon";
  if (/sun(?!screen)|steering|garden/.test(s)) return "sun";
  if (/night|sleep|bedroom|moon/.test(s)) return "night";
  if (/doctor|patient|grandmother|grandchild|couple|thoughtful|folded/.test(s)) return "people";
  if (/sunscreen|spf/.test(s)) return "sunscreen";
  if (/calendar|clock|sunrise|season/.test(s)) return "clock";
  if (/smil|morning light|healthy/.test(s)) return "close";
  return "hands";
}
const rot = {};
async function dl(url, dest) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; } const b = Buffer.from(await r.arrayBuffer()); if (b.length < 20000) { await sleep(600); continue; } fs.writeFileSync(dest, b); return true; } catch { await sleep(900); } } return false; }

let ok = 0;
for (const name of finalBad) {
  const p = pool(qOf[name]);
  const arr = POOLS[p];
  const q = arr[(rot[p] = (rot[p] ?? -1) + 1) % arr.length];
  const dest = `${outDir}/${name}.mp4`;
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 8, used); } catch { hit = null; } if (hit && hit.link) break; }
  if (hit && hit.link && await dl(hit.link, dest)) { ok++; if (hit.key) used.add(hit.key); console.log("FINAL", name, "|", q); }
  else console.log("miss", name, "|", q);
  await sleep(250);
}
console.log(`\nrequery3: ${ok}/${finalBad.length} refetched with safe queries`);
