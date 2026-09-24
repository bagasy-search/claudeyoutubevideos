// ⛔ DEPRECADO (jul 2026): este script es del pipeline v3 VIEJO de la raíz. Usar la
// carpeta match_v3/ (lib+2_search_mosaics+split_judge+3_assemble+4_stills+5_apply_verdicts),
// que tiene los fixes de geometría por fragmento, filtro duro pre-juez, blocklist y
// verificación obligatoria. Este archivo queda solo por compatibilidad con corridas viejas.
console.error('⛔ DEPRECADO: usá la carpeta match_v3/ (ver match_v3/README.md). Este script raíz tiene bugs ya corregidos allá.');
// match_v3_beats.mjs — convierte el match list del build (public/broll/match_<slug>.json,
// formato {name, concept, query[]}) al formato que consume match_v3_probe.mjs
// ({name, desc, queries[]}). Opcional: --slice a:b para probar un subconjunto.
//
// Las queries del build YA vienen con ancla de sujeto (regla #1 de match_v3), así que
// solo se renombra concept→desc y query→queries. Si un beat trae una sola query string,
// se envuelve en array.
//
// Uso: node match_v3_beats.mjs <slug> [outPath=_v3/<slug>_beats.json] [--slice a:b]
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const slug = args[0];
if (!slug) { console.error("Uso: node match_v3_beats.mjs <slug> [out] [--slice a:b]"); process.exit(1); }
const sliceArg = (args.find((a) => a.startsWith("--slice")) || "").split("=")[1]
  || (args.includes("--slice") ? args[args.indexOf("--slice") + 1] : "");
const outPath = args[1] && !args[1].startsWith("--") ? args[1] : `_v3/${slug}_beats.json`;

const src = JSON.parse(fs.readFileSync(`public/broll/match_${slug}.json`, "utf8"));
let beats = src.map((b) => ({
  name: b.name,
  desc: b.desc || b.concept || "",
  queries: Array.isArray(b.query) ? b.query : (b.query ? [b.query] : (b.queries || [])),
  dur: b.dur || 6,
}));
if (sliceArg) { const [a, c] = sliceArg.split(":").map(Number); beats = beats.slice(a || 0, c || beats.length); }

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(beats, null, 2));
console.log(`✓ ${beats.length} beats → ${outPath}`);
