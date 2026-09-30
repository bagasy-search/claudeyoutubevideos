// borrar.mjs — BORRADO QUE NO ATRAVIESA ENLACES.
//
// ⛔⛔ La mina más cara del proyecto: en Windows, un borrado recursivo sobre una carpeta que tiene un
// JUNCTION adentro **atraviesa el enlace** y se lleva el destino real. Ya ocurrió cuatro veces: tres
// se llevaron `public/` entero, y la noche del 21-sep-2026 desaparecieron 3.557 archivos versionados
// (`src/`, `scripts/`, casi toda `factory/`), el `.env` con todas las claves —de ahí sólo se recuperó
// lo que había en copias viejas; `RUNPOD_API_KEY` se perdió— y un `_meta.json` suelto.
// Los worktrees de render se arman con junctions a `public/` y `_v3/` justamente para no copiar 30 GB.
//
// Regla: antes de borrar un árbol se recorre buscando enlaces. Si hay UNO, no se borra nada y se
// explica cuál. Desarmar un junction se hace con `fs.rmdirSync` sobre el enlace (no borra el destino).
import fs from "node:fs";
import path from "node:path";

/** Devuelve la lista de enlaces (junction/symlink) que hay dentro de `p`, incluido `p`. */
export function enlacesDentro(p, { max = 20000 } = {}) {
  const hallados = [];
  let vistos = 0;
  const ver = (q) => {
    if (hallados.length || vistos++ > max) return;
    let st;
    try { st = fs.lstatSync(q); } catch { return; }
    if (st.isSymbolicLink()) { hallados.push(q); return; }
    if (!st.isDirectory()) return;
    let hijos = [];
    try { hijos = fs.readdirSync(q); } catch { return; }
    for (const h of hijos) ver(path.join(q, h));
  };
  ver(p);
  return hallados;
}

/** Borra `p` SÓLO si no hay ningún enlace adentro. Devuelve true si borró. */
export function borrarSeguro(p, { log = console.log } = {}) {
  if (!fs.existsSync(p)) return false;
  const enlaces = enlacesDentro(p);
  if (enlaces.length) {
    log(`⛔ NO borro ${p}: tiene un enlace adentro (${enlaces[0]}). Un borrado recursivo lo ATRAVIESA y se lleva el destino real.`);
    log(`   Desarmá el junction primero (rmdir sobre el enlace, sin /S) y volvé a intentar.`);
    return false;
  }
  fs.rmSync(p, { recursive: true, force: true });
  return true;
}
