// requery_hs2.mjs — re-fetch los clips flagged off-topic con queries SIMPLES por tema (fix nicho escaso).
// Lee _hs_verdicts.json (flagged) + dense_thinnedH.json (query original) → mapea a query simple → re-fetch fresh.
// Escribe _hs_imgaudit2.json (solo requeried) para re-auditar.
import fs from "fs";
import { execFileSync } from "child_process";
import { pexelsVideo, pixabayVideo, archiveVideo, usedRegistry } from "./stock_lib.mjs";

const verdicts = JSON.parse(fs.readFileSync("_hs_verdicts.json", "utf8"));
const flagged = new Set(verdicts.filter((v) => !v.ok).map((v) => v.name));
const dense = JSON.parse(fs.readFileSync("public/broll/dense_thinnedH.json", "utf8"));
const used = usedRegistry();
const outDir = "public/broll/handsage";
const SP = process.env.SP;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// pools SIMPLES (sustantivos Pexels-friendly) por tema; se rota para variar
const POOLS = {
  root: ["dried herbs close up", "herbal tea being poured", "wooden bowl of dried herbs", "loose leaf tea macro", "mortar and pestle with herbs", "dried plant roots on wood", "cup of herbal tea steam"],
  hands: ["senior woman hands close up", "elderly hands wrinkled", "old person hands", "wrinkled hands close up", "senior hands folded", "aging skin on hand macro"],
  cream: ["face cream jar close up", "applying cream to hand", "skincare bottle on table", "hand cream tube", "cosmetic jar macro"],
  lemon: ["lemon slice close up", "cutting a lemon", "fresh lemons on table", "lemon juice squeeze"],
  sun: ["sunlight through a window", "warm sunlight on skin", "bright morning sun", "sun flare nature"],
  night: ["woman sleeping in bed", "dark bedroom at night", "moon through a window", "quiet night bedroom"],
  people: ["senior woman smiling", "older woman portrait", "grandmother and grandchild", "elderly couple at home"],
  sunscreen: ["applying sunscreen on skin", "sunscreen bottle close up", "sun cream on hand"],
  clock: ["clock ticking close up", "calendar pages turning", "sunrise time lapse"],
  close: ["happy senior woman by window", "older woman smiling warm light", "healthy hands warm light"],
};
function pool(q) {
  const s = q.toLowerCase();
  if (/licorice|root|herb|tea|ginger|apothecar/.test(s)) return "root";
  if (/hand|spot|wrinkl|skin|elderly|aging|liver/.test(s)) return "hands";
  if (/cream|serum|cosmetic|pharmacy|skincare product/.test(s)) return "cream";
  if (/lemon/.test(s)) return "lemon";
  if (/sun(?!screen)|steering|garden|sunlight/.test(s)) return "sun";
  if (/night|sleep|bedroom|moon/.test(s)) return "night";
  if (/doctor|patient|grandmother|grandchild|couple|woman thoughtful|folded/.test(s)) return "people";
  if (/sunscreen|spf/.test(s)) return "sunscreen";
  if (/calendar|clock|sunrise|season/.test(s)) return "clock";
  if (/smil|morning light|healthy/.test(s)) return "close";
  return "hands";
}
const rot = {};
async function dl(url, dest) { for (let a = 0; a < 3; a++) { try { const r = await fetch(url); if (!r.ok) { await sleep(700); continue; } const b = Buffer.from(await r.arrayBuffer()); if (b.length < 20000) { await sleep(600); continue; } fs.writeFileSync(dest, b); return true; } catch { await sleep(900); } } return false; }

const man2 = [];
let ok = 0;
for (const d of dense) {
  if (!flagged.has(d.name)) continue;
  const p = pool(d.query);
  const arr = POOLS[p];
  const idx = (rot[p] = (rot[p] ?? -1) + 1) % arr.length;
  const q = arr[idx];
  const dest = `${outDir}/${d.name}.mp4`;
  let hit = null;
  for (const fn of [pexelsVideo, pixabayVideo, archiveVideo]) { try { hit = await fn(q, 6, used); } catch { hit = null; } if (hit && hit.link) break; }
  if (hit && hit.link && await dl(hit.link, dest)) {
    ok++; if (hit.key) used.add(hit.key);
    // re-extraer frame para re-auditar
    try { execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", dest, "-frames:v", "1", "-vf", "scale=400:-1", `${SP}/${d.name}.jpg`], { stdio: "ignore" }); } catch {}
    man2.push({ name: d.name, path: `${SP}/${d.name}.jpg`, phrase: q });
    console.log("RQ", d.name, "|", q);
  } else console.log("STILL MISS", d.name, "|", q);
  await sleep(250);
}
fs.writeFileSync("_hs_imgaudit2.json", JSON.stringify(man2, null, 1));
console.log(`\nrequery2: ${ok}/${flagged.size} refetched`);
