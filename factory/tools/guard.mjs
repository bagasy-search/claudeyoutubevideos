// guard.mjs — GUARDIA ANTI-REGRESIÓN (F2). Corre en CI y antes de cada commit de la fábrica.
//
// Falla si:
//   1. aparece un script POR SLUG nuevo trackeado fuera de factory/ (build_<x>.mjs, gen_agnes_*_<slug>.mjs,
//      _<slug>_dispatch.sh, farm_stitchraw_<slug>.mjs, <slug>_runpod*.{sh,mjs}) que no esté en la lista
//      congelada de legado (factory/tools/legacy_allowlist.txt).
//   2. hay una CLAVE quemada en un archivo trackeado (RunPod rpa_, OpenAI sk-, GitHub ghp_/github_pat_,
//      Supabase service_role JWT). El repo es PÚBLICO.
//   3. factory/ importa algo de _archive/ o de un script por slug.
//
//   node factory/tools/guard.mjs            (sobre `git ls-files`)
//   node factory/tools/guard.mjs --freeze   (regenera la lista de legado: SÓLO al crear la fábrica)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ROOT } from "../lib/env.mjs";

const ALLOW = path.join(ROOT, "factory", "tools", "legacy_allowlist.txt");
export const SLUG_SCRIPT = /(^|\/)(build_[a-z0-9_]+\.mjs|gen_agnes_(i2v|video|img|ref)_[a-z0-9_]+\.mjs|_[a-z0-9]+_(dispatch|farm|deliver|avatar|runpod)[a-z0-9_]*\.(sh|mjs)|farm_stitchraw_[a-z0-9_]+\.mjs|[a-z0-9]+_runpod[a-z0-9_]*\.(sh|mjs)|redibujo_[a-z0-9]+\.mjs)$/;
export const SECRET = [
  [/rpa_[A-Za-z0-9]{30,}/, "RunPod API key"],
  [/sk-(proj-)?[A-Za-z0-9_-]{32,}/, "OpenAI key"],
  [/gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/, "GitHub token"],
  [/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]*cm9sZSI6InNlcnZpY2Vfcm9sZ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+/, "Supabase service_role"],
];

export function checkFiles(files, { allow = new Set(), read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8") } = {}) {
  const prob = [];
  for (const f of files) {
    if (f.startsWith("factory/") || f.includes("_archive/")) continue;
    if (SLUG_SCRIPT.test(f) && !allow.has(f)) prob.push(`script POR SLUG nuevo: ${f} (la fábrica lo prohíbe: el caso va en factory/specs/<slug>.json)`);
  }
  for (const f of files) {
    if (!/\.(mjs|js|ts|tsx|sh|py|json|yml|yaml|md|txt|env)$/i.test(f) || f.endsWith("legacy_allowlist.txt")) continue;
    let s;
    try { s = read(f); } catch { continue; }
    if (s.length > 2_000_000) continue;
    for (const [re, nombre] of SECRET) if (re.test(s)) prob.push(`CLAVE QUEMADA (${nombre}) en ${f}`);
    if (f.startsWith("factory/") && !f.startsWith("factory/tests/") && /from\s+["'][^"']*(_archive\/|\/build_[a-z0-9]+\.mjs|gen_agnes_i2v_[a-z0-9]+)/.test(s)) prob.push(`factory importa legado: ${f}`);
  }
  return prob;
}

const esMain = !!process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (esMain) {
  const files = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).split("\n").filter(Boolean);
  if (process.argv.includes("--freeze")) {
    // UNIÓN: lo que ya estaba congelado + el legado del árbol local + el de las refs pedidas (--ref main --ref factory).
    // Congelar sólo desde la rama local dejó afuera 8 scripts viejos que main ya tenía (CI rojo, 15-sep-2026).
    const refs = process.argv.flatMap((a, i) => (a === "--ref" ? [process.argv[i + 1]] : []));
    const deRef = (r) => execFileSync("git", ["ls-tree", "-r", "--name-only", r], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).split("\n").filter(Boolean);
    const prev = fs.existsSync(ALLOW) ? fs.readFileSync(ALLOW, "utf8").split(/\r?\n/).filter(Boolean) : [];
    const todos = [...files, ...refs.flatMap(deRef)];
    const legacy = [...new Set([...prev, ...todos.filter((f) => !f.startsWith("factory/") && SLUG_SCRIPT.test(f))])].sort();
    fs.writeFileSync(ALLOW, legacy.join("\n") + "\n");
    console.log(`lista de legado congelada: ${legacy.length} scripts por slug (unión de ${prev.length} previos + local + ${refs.join(", ") || "sin refs"})`);
    process.exit(0);
  }
  const allow = new Set(fs.existsSync(ALLOW) ? fs.readFileSync(ALLOW, "utf8").split(/\r?\n/).filter(Boolean) : []);
  const prob = checkFiles(files, { allow });
  console.log(`GATE guard: inspeccionó=${files.length} archivos trackeados · legado permitido ${allow.size} · problemas=${prob.length} ${prob.length ? "⛔" : "✓"}`);
  for (const p of prob.slice(0, 40)) console.log("  ⛔ " + p);
  if (!files.length) { console.log("  ⛔ 0 archivos inspeccionados"); process.exit(1); }
  process.exit(prob.length ? 1 : 0);
}
