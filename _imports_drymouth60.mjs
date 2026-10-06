// _imports_drymouth60.mjs — COMPUERTA: cada import NOMBRADO del Main tiene que existir
// como export REAL en su archivo. Un nombre que no existe llega como `undefined` a React y
// mata los 60 chunks con "Minified React error #130", que no dice qué componente fue.
// ⛔ Pasó en este video: cloné AvatarLayerLoopFcs -> AvatarLayerLoopAgu, cambié el import y la
//    etiqueta, y me olvidé de renombrar el `export const` adentro del clon. `tsc -p` NO lo marcó.
import fs from "node:fs";
import path from "node:path";

const ENTRADAS = [
  "src/_fed6/VideoEdit/Main_drymouth60.tsx",
  "src/index_drymouth60.tsx",
];
const RE = /import\s*\{([^}]+)\}\s*from\s*"(\.[^"]+)"/g;
let malos = 0, revisados = 0, archivos = 0;

for (const entry of ENTRADAS) {
  const src = fs.readFileSync(entry, "utf8");
  const dir = path.dirname(entry);
  for (const m of src.matchAll(RE)) {
    const nombres = m[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    let f = null;
    for (const ext of [".tsx", ".ts", ""]) {
      const p = path.join(dir, m[2] + ext);
      if (fs.existsSync(p) && fs.statSync(p).isFile()) { f = p; break; }
    }
    if (!f) { console.log(`  ⛔ no resuelve el módulo ${m[2]} (desde ${entry})`); malos++; continue; }
    archivos++;
    const dest = fs.readFileSync(f, "utf8");
    for (const n of nombres) {
      revisados++;
      const ok = new RegExp(`export\\s+(const|function|class|type|interface|let|var)\\s+${n}\\b`).test(dest)
        || new RegExp(`export\\s*\\{[^}]*\\b${n}\\b[^}]*\\}`).test(dest);
      if (!ok) { console.log(`  ⛔ ${entry}: "${n}" NO está exportado en ${f}`); malos++; }
    }
  }
}
console.log(`IMPORTS: ${revisados} nombres revisados en ${archivos} módulos · rotos ${malos}`);
process.exit(malos ? 1 : 0);
