// ref_files.mjs — lista los archivos del ARBOL DE IMPORTS que NO estan en un commit dado.
//
// ⛔⛔ POR QUE EXISTE: `check_arbol_imports.mjs` mira el INDICE (`git ls-files`), y un archivo
//    puede estar STAGED por otra sesion y NO estar en ningun COMMIT. El farm hace checkout del
//    COMMIT, asi que ese archivo no viaja y los 60 chunks mueren con "Cannot find module".
//    Medido acá: `src/rksafe/` (13 archivos, el kit ENTERO del canal) estaba staged pero nunca
//    commiteado en la rama base, y la compuerta lo dio por bueno.
//
//   node scripts/ref_files.mjs <entry> <commit> [out.txt]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const [ENTRY, COMMIT, OUT] = process.argv.slice(2);
if (!ENTRY || !COMMIT) { console.error("uso: node scripts/ref_files.mjs <entry> <commit> [out.txt]"); process.exit(1); }

const EXT = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts", "/index.js"];
const vistos = new Set();
const cola = [ENTRY.replace(/\\/g, "/")];
while (cola.length) {
  const f = cola.pop();
  if (vistos.has(f) || !fs.existsSync(f)) continue;
  vistos.add(f);
  let t = "";
  try { t = fs.readFileSync(f, "utf8"); } catch { continue; }
  const dir = path.posix.dirname(f);
  for (const m of t.matchAll(/(?:from|import)\s+["'](\.[^"']+)["']/g)) {
    const base = path.posix.join(dir, m[1]);
    for (const e of EXT) {
      const c = base + e;
      if (fs.existsSync(c) && fs.statSync(c).isFile()) { cola.push(c); break; }
    }
  }
}
const arbol = [...vistos].sort();
const enCommit = new Set(
  execSync(`git ls-tree -r --name-only ${COMMIT}`, { encoding: "utf8", maxBuffer: 1e9 }).trim().split("\n")
);
const faltan = arbol.filter((f) => !enCommit.has(f));

// ⛔ una compuerta que puede dar 0 sin mirar tiene que decir CUANTO midio
console.log(`arbol de imports desde ${ENTRY}: ${arbol.length} archivos`);
console.log(`ya estan en ${COMMIT.slice(0, 8)}: ${arbol.length - faltan.length}`);
console.log(`FALTAN en el commit (no viajarian al farm): ${faltan.length}`);
for (const f of faltan) console.log("   +", f);
if (OUT) { fs.writeFileSync(OUT, faltan.join("\n") + (faltan.length ? "\n" : "")); console.log(`escrito: ${OUT}`); }
if (arbol.length < 5) { console.error("⛔ el arbol tiene menos de 5 archivos: el entry esta mal"); process.exit(1); }
