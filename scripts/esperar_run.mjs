#!/usr/bin/env node
// esperar_run.mjs — reemplazo de `gh run watch <id> --exit-status` que NO quema la API de GitHub.
//
//   node scripts/esperar_run.mjs <run_id> [--repo dueño/repo] [--poll-min 5]
//   → exit 0 si el run terminó en success sin jobs caídos, 1 si falló/canceló.
//
// ⛔ `gh run watch` consulta cada 3 s y con varios renders a la vez dispara el 403 de límite SECUNDARIO:
//    el script se moría diciendo "la corrida falló" con el render sano (farm-run-watch-quema-la-api).
//    Acá: 1 llamada cada 5 min, la lista de jobs cada 20 min, y un 403 NO corta la espera.
//    Los cuelgues los corta GitHub (timeout-minutes de cada job), no hace falta preguntar seguido.
import { execSync } from "node:child_process";
import { waitRun } from "../factory/lib/gh.mjs";

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const runId = args.find((a) => /^\d+$/.test(a));
if (!runId) { console.error("uso: node scripts/esperar_run.mjs <run_id> [--repo dueño/repo] [--poll-min 5]"); process.exit(2); }

// el repo sale del remote (sin gastar una llamada a la API)
let repo = opt("--repo");
if (!repo) {
  const url = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
  repo = (url.match(/github\.com[:/](.+?)(?:\.git)?$/) || [])[1];
  if (!repo) { console.error(`no pude sacar el repo de ${url}: pasá --repo dueño/repo`); process.exit(2); }
}
const pollMs = Number(opt("--poll-min") || 5) * 60_000;
const t = () => new Date().toLocaleTimeString("es-AR", { hour12: false });

try {
  const r = await waitRun(repo, runId, { pollMs, log: (l) => console.log(`[${t()}] ${l}`) });
  if (r.ok) { console.log(`✓ run ${runId} terminó bien`); process.exit(0); }
  console.error(`✗ run ${runId}: ${r.conclusion}${r.jobsBad ? ` · ${r.jobsBad} job(s) caído(s)` : ""} — revisá: gh run view ${runId}`);
  process.exit(1);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
