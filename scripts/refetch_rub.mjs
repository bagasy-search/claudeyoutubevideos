// refetch_rub.mjs — re-baja clips mismatch del AUDITOR con queries mejores (borra el malo primero).
import fs from "fs";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";
const outDir = "public/broll/rosemaryrub";
const used = usedRegistry();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FIX = [
  ["d011", "elderly wrinkled skin folds macro"],
  ["d012", "woman applying face cream to cheek"],
  ["d014", "woman pinching cheek skin"],
  ["d015", "worried senior woman forehead wrinkles"],
  ["d018", "dermatologist examining woman face skin"],
  ["d055", "dry flaky facial skin macro"],
  ["d061", "woman shopping skincare store shelf"],
  ["d064", "woman washing face with water"],
  ["d069", "herbs infusing in olive oil jar"],
  ["d075", "woman pressing fingers on cheek skin"],
  ["d080", "woman tapping fingertips on face"],
  ["d093", "dropper oil on inner wrist skin"],
  ["d094", "woman scratching itchy arm skin"],
  ["d101", "woman wiping face with cotton pad"],
  ["d107", "woman splashing water on face close up"],
  ["d109", "woman pressing cheeks with fingertips"],
  ["d112", "back of aged hand skin close up wrinkles"],
];
async function dl(url, dest) {
  for (let a = 0; a < 3; a++) {
    try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; }
      const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 20000) { await sleep(500); continue; }
      fs.writeFileSync(dest, buf); return true; } catch { await sleep(900); }
  } return false;
}
let ok = 0, miss = 0;
for (const [name, q] of FIX) {
  const dest = `${outDir}/${name}.mp4`;
  try { fs.rmSync(dest, { force: true }); } catch {}
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 5, used); } catch { hit = null; } if (hit && hit.link) break; }
  if (!hit || !hit.link) { console.log("MISS", name, "|", q); miss++; continue; }
  const done = await dl(hit.link, dest);
  if (done) { ok++; if (hit.key) used.add(hit.key); console.log("OK", name, (hit.src||"").slice(0,30), "|", q.slice(0,42)); }
  else { console.log("DLFAIL", name); miss++; }
  await sleep(250);
}
console.log(`\n=== refetch: ${ok} OK · ${miss} MISS de ${FIX.length} ===`);
