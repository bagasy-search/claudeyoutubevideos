// matchfarm.mjs — ORQUESTADOR del matcher CLIP distribuido en GitHub Actions.
// Sube el match list como release, dispara match.yml (N runners en paralelo),
// espera y descarga clips_<slug>_matched.json a public/broll/ (listo para fetch_clips).
//
// Requisitos: repo público con .github/workflows/match.yml, `gh` autenticado, y
// public/broll/match_<slug>.json ya armado (el shotlist de conceptos).
//
// Uso:  node scripts/matchfarm.mjs <slug> [chunks=20]
import { execSync } from "node:child_process";
import fs from "node:fs";

const [slug, chunks = "20"] = process.argv.slice(2);
if (!slug) { console.error("Uso: node scripts/matchfarm.mjs <slug> [chunks]"); process.exit(1); }
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

const listSrc = `public/broll/match_${slug}.json`;
if (!fs.existsSync(listSrc)) { console.error("falta:", listSrc); process.exit(1); }

// 1) subir el match list como release asset (con el nombre que el workflow espera)
const flat = `match_${slug}.json`;
fs.copyFileSync(listSrc, flat);
const relTag = `match-${slug}`;
try { out(`gh release view ${relTag}`); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch { /* no existe */ }
sh(`gh release create ${relTag} ${flat} --title ${relTag} --notes "match list"`);
fs.rmSync(flat);

// 2) disparar
console.log("disparando match.yml ...");
sh(`gh workflow run match.yml${process.env.FARM_REF ? ` --ref ${process.env.FARM_REF}` : ""} -f slug=${slug} -f chunks=${chunks}`);

// 3) esperar y descargar
execSync("sleep 8 2>/dev/null || ping -n 9 127.0.0.1 >NUL", { stdio: "ignore", shell: true });
// AISLAMIENTO: filtrar por la rama PROPIA de este video (molino-<slug>), si no con varios agentes
// matcheando a la vez agarrábamos "el run más reciente de match.yml" que podía ser el de OTRO video
// → descargábamos sus clips (mismo bug de cruce que ya arreglamos en el b-roll). Igual que farm.mjs.
const _mfBranch = process.env.FARM_REF || `molino-${slug}`;
const runId = out(`gh run list --workflow=match.yml -b ${_mfBranch} --limit 1 --json databaseId --jq ".[0].databaseId"`);
console.log("corrida:", runId, "— siguiendo ...");
try { sh(`gh run watch ${runId} --exit-status --interval 15`); } catch { console.error("fallo; revisá: gh run view " + runId); process.exit(1); }
sh(`gh run download ${runId} -n matched-${slug} -D public/broll`);
console.log(`\n✅ listo → public/broll/clips_${slug}_matched.json`);
console.log(`Revisá los _score y luego: node fetch_clips.mjs public/broll/clips_${slug}_matched.json`);
