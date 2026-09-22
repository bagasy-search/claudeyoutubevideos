// Recorre el grafo de imports relativos desde el entry y lista los archivos que NO están en git.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const tracked = new Set(execSync("git ls-files", { encoding: "utf8", maxBuffer: 64e6 }).split("\n").map((s) => s.trim()).filter(Boolean));
const EXT = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"];
const resolveRel = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  for (const e of ["", ...EXT]) { const p = base + e; if (fs.existsSync(p) && fs.statSync(p).isFile()) return p; }
  for (const e of EXT) { const p = path.join(base, "index" + e); if (fs.existsSync(p)) return p; }
  return null;
};
const seen = new Set(), faltan = [], noResuelve = [];
const visit = (f) => {
  if (seen.has(f)) return;
  seen.add(f);
  const rel = path.relative(process.cwd(), f).replace(/\\/g, "/");
  if (!tracked.has(rel)) faltan.push(rel);
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/(?:from|import)\s+["'](\.[^"']+)["']/g)) {
    const t = resolveRel(f, m[1]);
    if (t) visit(t); else noResuelve.push(`${rel} → ${m[1]}`);
  }
};
visit(path.resolve(process.argv[2]));
console.log(`archivos del grafo: ${seen.size}`);
console.log(`NO commiteados: ${faltan.length}`);
faltan.forEach((f) => console.log("   ⛔ " + f));
if (noResuelve.length) { console.log(`imports sin resolver: ${noResuelve.length}`); noResuelve.slice(0, 10).forEach((x) => console.log("   ? " + x)); }
