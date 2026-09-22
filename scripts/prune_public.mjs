// scripts/prune_public.mjs — arma un `publicDir` PODADO con sólo los assets de un slug.
//
// ⛔ POR QUÉ. En Windows `symlinkPublicDir` es no-op: Remotion COPIA `public/` entero a cada
//    bundle. `public/` pesa 72 GB, así que cada bundle quiere 72 GB. Cuatro corridas llenaron
//    un disco de 932 GB, y entonces `bundle()` devolvió "OK" habiendo emitido un directorio
//    SIN `bundle.js` → el barrido no renderizó un solo frame y la compuerta leyó
//    "0 stills = 0 negros" y dio verde. Un falso PASS que se entrega.
//
// Los archivos van por HARD LINK (mismo volumen que `public/`): instantáneo y sin ocupar
// espacio. Si el link falla (otro volumen, FS raro), copia.
//
//   import { prunePublic } from "./prune_public.mjs";
//   const publicDir = prunePublic("fcspuntos");
import fs from "node:fs";
import path from "node:path";

export function prunePublic(slug, { lista = `_${slug}_assets.txt`, dest = path.resolve(`.pubprune/${slug}`) } = {}) {
  if (!fs.existsSync(lista)) throw new Error(`⛔ falta ${lista} — corré primero el build del slug`);
  const entradas = fs.readFileSync(lista, "utf8").trim().split("\n").map((x) => x.trim()).filter(Boolean);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  let ok = 0, faltan = 0;
  for (const rel of entradas) {
    const src = path.resolve("public", rel);
    if (!fs.existsSync(src)) { faltan++; continue; }
    const dst = path.join(dest, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    try { fs.linkSync(src, dst); } catch { fs.copyFileSync(src, dst); }
    ok++;
  }
  // el audio del video no siempre está en la lista de assets
  for (const extra of [`${slug}.m4a`, `${slug}.wav`]) {
    const src = path.resolve("public", extra);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(dest, extra);
    if (fs.existsSync(dst)) continue;
    try { fs.linkSync(src, dst); } catch { fs.copyFileSync(src, dst); }
    ok++;
  }
  if (!ok) throw new Error(`⛔ el publicDir podado quedó VACÍO (${lista} tiene ${entradas.length} entradas)`);
  console.log(`publicDir podado: ${ok} assets en ${dest}${faltan ? ` · ${faltan} de la lista no están en disco` : ""}`);
  return dest;
}

/** bundle() puede devolver un directorio SIN bundle.js cuando se queda sin disco. */
export function exigirBundle(serveUrl) {
  const dir = String(serveUrl).replace(/^file:\/\/\//, "").replace(/\//g, path.sep);
  const js = path.join(dir, "bundle.js");
  if (!fs.existsSync(js)) throw new Error(`⛔ bundle() devolvió OK pero NO hay bundle.js en ${dir} (¿disco lleno?)`);
  return serveUrl;
}
