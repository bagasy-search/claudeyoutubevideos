// stockfallback.mjs — reemplaza los clips de YouTube MALOS por STOCK multi-fuente
// (cascada Pexels → Pixabay → Archive.org → foto Ken-Burns, con dedup global y
// selección por calidad — scripts/stock_lib.mjs).
//
// DOS MODOS:
//   A) node scripts/stockfallback.mjs <slug> [umbral=0.85] [--dry]
//      Modo clásico: lee clips_<slug>_matched.json + match_<slug>.json y reemplaza
//      los beats con _score < umbral o sin match. IMPORTANTE: el pipeline v3 deja
//      los clips en _score 0.5 hasta que el VERIFICADOR los aprueba (0.99) — si se
//      corre esto sin verificar, TODO cae a stock (a propósito: quality-first).
//   B) node scripts/stockfallback.mjs --list <needstock.json> [--dry]
//      Resuelve una lista directa [{name, concept, query?, dur, why?}] — la emiten
//      3_assemble (_needstock), 5_apply_verdicts (_needstock) y fetch_clips (_failed).
//
// --dry = solo lista qué reemplazaría, sin bajar nada.
import fs from "fs";
import { acquireStock } from "./stock_lib.mjs";

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const listIdx = args.indexOf("--list");
const OUT = "public/broll";

let bad = [];
let matchedPath = null, matched = null;

if (listIdx >= 0) {
  const listFile = args[listIdx + 1];
  if (!listFile || !fs.existsSync(listFile)) { console.error("Falta el JSON de --list"); process.exit(1); }
  bad = JSON.parse(fs.readFileSync(listFile, "utf8").replace(/^﻿/, ""));
  console.log(`modo lista: ${bad.length} beats a resolver por stock (${listFile})`);
} else {
  const pos = args.filter((a) => !a.startsWith("--"));
  const [slug, thrArg] = pos;
  if (!slug) { console.error("Uso: node scripts/stockfallback.mjs <slug> [umbral=0.85] [--dry]  |  --list <needstock.json> [--dry]"); process.exit(1); }
  const THR = +(thrArg || 0.85);
  matchedPath = `${OUT}/clips_${slug}_matched.json`;
  const listPath = `${OUT}/match_${slug}.json`;
  matched = JSON.parse(fs.readFileSync(matchedPath, "utf8").replace(/^﻿/, ""));
  const list = JSON.parse(fs.readFileSync(listPath, "utf8").replace(/^﻿/, ""));
  const byName = new Map(matched.map((c) => [c.name, c]));
  for (const b of list) {
    const m = byName.get(b.name);
    if (!m) bad.push({ ...b, reason: "sin match" });
    else if ((m._score ?? 1) < THR) bad.push({ ...b, reason: m._verified === false ? `sin verificar (score ${m._score})` : `score ${m._score}` });
  }
  console.log(`umbral ${THR} · ${bad.length}/${list.length} beats a reemplazar por stock:`);
}

for (const b of bad) console.log(`  ${b.name}  (${b.reason || b.why || "lista"})  → "${(b.concept || "").slice(0, 70)}"`);
if (DRY) { console.log("\n[--dry] no se bajó nada."); process.exit(0); }
if (!bad.length) { console.log("nada que reemplazar ✓"); process.exit(0); }

let okN = 0, failN = 0;
const replacedNames = new Set();
for (const b of bad) {
  const got = await acquireStock({ name: b.name, concept: b.concept, query: b.query, queries: b.queries, dur: b.dur }, OUT);
  if (got) { okN++; replacedNames.add(b.name); }
  else { console.log(`  ✗ ${b.name}  sin stock en NINGUNA fuente para "${b.concept}" → resolver con imagen generada (gen_comfy/deAPI)`); failN++; }
}

// saca de matched.json los reemplazados (para que fetch_clips no los pise)
if (matched && replacedNames.size) {
  const keep = matched.filter((c) => !replacedNames.has(c.name));
  fs.writeFileSync(matchedPath, JSON.stringify(keep, null, 2));
}
console.log(`\n=== stock: ${okN} resueltos · ${failN} sin stock (→ imagen generada) ${matched ? `· matched.json depurado (${replacedNames.size} fuera)` : ""} ===`);
