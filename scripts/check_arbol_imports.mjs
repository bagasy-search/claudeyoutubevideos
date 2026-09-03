// check_arbol_imports.mjs — COMPUERTA: cada nombre importado de un módulo LOCAL existe como
// export REAL en ese archivo.
//
//   node scripts/check_arbol_imports.mjs src/index_<slug>.tsx src/<slug>/Main_<slug>.tsx ...
//
// Por qué existe: clonar una escena y no renombrar su `export const` deja el import como
// `undefined` y React tira `Minified React error #130`, que NO dice qué componente fue. Como el
// avatar es el piso del video, eso mata los 60 chunks. `tsc -p` NO lo marca.
// Escrito sin regex con escapes a propósito: el shell los mastica y la compuerta termina
// midiendo cero (ya pasó: "0 rotos" con un regex que nunca podía matchear).
import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2);
const KINDS = ["const", "function", "class", "type", "interface", "default", "let", "var"];
const isName = (c) => !!c && /[A-Za-z0-9_$]/.test(c);

let nombres = 0, mods = 0, roto = 0;

for (const r of roots) {
  const s = fs.readFileSync(r, "utf8");
  let i = 0;
  while ((i = s.indexOf("import", i)) !== -1) {
    const open = s.indexOf("{", i);
    const fromI = s.indexOf("from", i);
    i += 6;
    if (open === -1 || fromI === -1 || open > fromI) continue;
    const close = s.indexOf("}", open);
    if (close === -1 || close > fromI) continue;
    const q1 = s.indexOf('"', fromI);
    const q2 = s.indexOf('"', q1 + 1);
    if (q1 === -1 || q2 === -1) continue;
    const spec = s.slice(q1 + 1, q2);
    if (spec[0] !== ".") continue;                       // sólo módulos locales

    const names = s.slice(open + 1, close)
      .split(",").map((x) => x.trim().split(" as ")[0].trim()).filter(Boolean);

    let f = path.join(path.dirname(r), spec);
    for (const ext of ["", ".tsx", ".ts"]) {
      if (fs.existsSync(f + ext) && fs.statSync(f + ext).isFile()) { f = f + ext; break; }
    }
    if (!fs.existsSync(f)) {
      console.log("  MODULO NO EXISTE: " + spec + " (desde " + r + ")");
      roto++; continue;
    }
    mods++;
    const src = fs.readFileSync(f, "utf8");

    for (const nm of names) {
      nombres++;
      let ok = false;
      for (const k of KINDS) {
        const pat = "export " + k + " " + nm;
        let j = 0;
        while ((j = src.indexOf(pat, j)) !== -1) {
          // ⛔ sin este corte, "export const FotoX" matchea la busqueda de "Foto" y la compuerta
          // da OK con el export ROTO (lo cazo el control negativo, no la corrida normal).
          if (!isName(src[j + pat.length])) { ok = true; break; }
          j += pat.length;
        }
        if (ok) break;
      }
      if (!ok) {
        // re-export en llaves:  export { A, B } from ...   /   export { A }
        let j = 0;
        while (!ok && (j = src.indexOf("export", j)) !== -1) {
          const b = s0(src, j);
          if (b !== -1) {
            const e = src.indexOf("}", b);
            if (e !== -1) {
              const lista = src.slice(b + 1, e).split(",").map((x) => x.trim().split(" as ")[0].trim());
              if (lista.includes(nm)) ok = true;
            }
          }
          j += 6;
        }
      }
      if (!ok) { console.log("  ROTO: " + nm + " no existe como export en " + f); roto++; }
    }
  }
}

// primera llave después de `export`, si sólo hay espacios en el medio
function s0(src, j) {
  let k = j + 6;
  while (k < src.length && (src[k] === " " || src[k] === "\t")) k++;
  return src[k] === "{" ? k : -1;
}

console.log("  " + nombres + " nombres revisados en " + mods + " modulos - rotos " + roto);
process.exit(roto ? 1 : 0);
