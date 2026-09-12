// check_arbol_git.mjs — COMPUERTA OBLIGATORIA ANTES DE CADA DESPACHO AL FARM.
//
// Recorre el árbol de imports desde `src/index_<slug>.tsx` y avisa de:
//   · archivos SIN TRACKEAR  -> el chunk muere con "Cannot find module" (mata los 60)
//   · archivos MODIFICADOS sin commitear -> el farm rendea la versión VIEJA, en silencio
//
// ⛔ Este repo lo comparten varias sesiones. DOS VECES en el mismo video un componente tenía
//    el arreglo escrito en el working dir por otra sesión y SIN COMMITEAR, y el farm rendeó
//    la versión rota: `AvatarLayerLoopFcs` (OffthreadVideo) y `PizarraExplica` (el nodo
//    numerado tapando las primeras letras de cada ítem). Los dos costaron un render entero.
//
// ⛔ Y NO alcanza con correrla una vez al principio: se corre ANTES DE CADA `gh workflow run`,
//    porque las otras sesiones siguen editando mientras vos rendeás.
//
//   node scripts/check_arbol_git.mjs [src/index_<slug>.tsx]

import fs from "fs"; import path from "path"; import { execSync } from "child_process";
const vistos = new Set(); const cola = [process.argv[2] || "src/index_fedguante.tsx"];
while (cola.length) {
  const f = cola.pop();
  if (vistos.has(f) || !fs.existsSync(f)) continue;
  vistos.add(f);
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const base = path.join(path.dirname(f), m[1]).split(path.sep).join("/");
    for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts", ""]) {
      const c = base + ext;
      if (fs.existsSync(c) && fs.statSync(c).isFile()) { cola.push(c); break; }
    }
  }
}
const arr = [...vistos].sort();
const sinTrack = [], modificados = [];
for (const f of arr) {
  try { execSync(`git ls-files --error-unmatch "${f}"`, { stdio: "ignore" }); }
  catch { sinTrack.push(f); continue; }
  const d = execSync(`git status --porcelain -- "${f}"`, { encoding: "utf8" }).trim();
  if (d) modificados.push(f);
}
console.log(`archivos en el arbol de imports: ${arr.length}`);
console.log(`SIN TRACKEAR (matarian los 60 chunks): ${sinTrack.length}`);
sinTrack.forEach((f) => console.log("   " + f));
console.log(`MODIFICADOS sin commitear (el farm rendearia la version VIEJA): ${modificados.length}`);
modificados.forEach((f) => console.log("   " + f));
if (sinTrack.length || modificados.length) process.exit(1);
