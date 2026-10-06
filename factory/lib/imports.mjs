// imports.mjs — árbol de imports RELATIVOS desde el entry del video.
// El farm rinde el COMMIT pero el tar sale del DISCO (8/60 chunks murieron con 404): la fase de render
// commitea EXACTAMENTE estos archivos, leídos del disco, así commit == disco por construcción.
import fs from "node:fs";
import path from "node:path";

const EXT = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"];

export function importTree(entryAbs, { root }) {
  const vistos = new Set(), faltan = [], externos = new Set();
  const cola = [path.resolve(entryAbs)];
  while (cola.length) {
    const f = cola.pop();
    if (vistos.has(f)) continue;
    vistos.add(f);
    const s = fs.readFileSync(f, "utf8");
    for (const m of s.matchAll(/(?:import|export)\s+(?:[^"';]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
      const spec = m[1] || m[2];
      if (!spec.startsWith(".")) { externos.add(spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/")); continue; }
      const base = path.resolve(path.dirname(f), spec);
      const hit = EXT.map((e) => base + e).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
      if (!hit) faltan.push(`${path.relative(root, f)} → ${spec}`); else if (!/\.(css|json)$/.test(hit) || true) cola.push(hit);
    }
  }
  const rel = [...vistos].map((f) => path.relative(root, f).split(path.sep).join("/")).sort();
  return { archivos: rel, faltan, externos: [...externos].sort() };
}
