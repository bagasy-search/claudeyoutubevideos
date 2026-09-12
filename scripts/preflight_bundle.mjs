// preflight_bundle.mjs — verifica que TODO import local del árbol de Root.tsx
// resuelva a un archivo TRACKEADO en git. Corré esto ANTES de scripts/farm.mjs:
// el farm hace checkout limpio de la branch, así que un archivo que existe en
// disco pero NO está commiteado (típico: Main_<x>.tsx nuevo + su .gen + su Kit)
// rompe el bundle con "Module not found" recién en el runner (2 fallos = 2 tarballs
// de ~1GB tirados). Esto lo caza en 1s local.
//   node scripts/preflight_bundle.mjs            # árbol de src/Root.tsx
//   node scripts/preflight_bundle.mjs src/X.tsx  # otro entrypoint
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const entry = process.argv[2] || "src/Root.tsx";
const tracked = new Set(execSync("git ls-files src", { encoding: "utf8" }).split(/\r?\n/).filter(Boolean));
const seen = new Set();
const missing = [];

function resolveTracked(from, imp) {
  const base = path.posix.dirname(from);
  const p = path.posix.normalize(path.posix.join(base, imp));
  for (const c of [p, p + ".tsx", p + ".ts", p + ".jsx", p + ".js", p + "/index.tsx", p + "/index.ts"]) if (tracked.has(c)) return c;
  return null;
}
function walk(f) {
  if (seen.has(f)) return;
  seen.add(f);
  let src;
  try { src = fs.readFileSync(f, "utf8"); } catch { return; }
  // sacar comentarios de línea y de bloque (evita matchear imports de ejemplo en comentarios)
  src = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  const re = /from\s+"(\.[^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    const r = resolveTracked(f, m[1]);
    if (r) { walk(r); continue; }
    // no está tracked: ¿existe en disco? (→ falta commitear) o ¿no existe? (import roto)
    const base = path.posix.dirname(f);
    const guess = path.posix.normalize(path.posix.join(base, m[1]));
    let onDisk = false;
    for (const ext of [".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"]) if (fs.existsSync(guess + ext)) { onDisk = true; break; }
    missing.push({ from: f, imp: m[1], onDisk });
  }
}

walk(entry);
console.log(`preflight ${entry}: ${seen.size} archivos visitados`);
if (!missing.length) { console.log("✓ todos los imports locales resuelven a archivos tracked — el farm va a bundlear OK"); process.exit(0); }
console.log("⚠ IMPORTS QUE ROMPERÁN EL FARM:");
for (const x of missing) console.log(`  ${x.from} → "${x.imp}"  ${x.onDisk ? "(existe en disco → FALTA git add)" : "(NO existe → import roto)"}`);
console.log(`\nFix: git add los archivos "(existe en disco)" y volvé a correr este preflight.`);
process.exit(1);
