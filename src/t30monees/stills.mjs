// stills de control t30monees (SÓLO fotos sueltas, NUNCA video): node src/t30monees/stills.mjs <outDir> <publicDir chico> <seg...>
// El public del slug NO se copia al bundle (E: es lento): se cuelga con uniones a public/img|broll/t30monees.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
const [outDir, publicDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const B = "D:/st_t30monees/bundle";   // bundle reusado: se rehace con REBUNDLE=1 (después de tocar código)
const win = (p) => p.split("/").join(path.win32.sep);
const J = (d) => win(`${B}/public/${d}/t30monees`);
const fresh = process.env.REBUNDLE || !fs.existsSync(B + "/index.html");
// ⛔ antes de rehacer el bundle se sacan las uniones con rmdir (si no, borrar el bundle se lleva las imágenes)
if (fresh) for (const d of ["img", "broll"]) if (fs.existsSync(J(d))) execSync(`cmd /c rmdir "${J(d)}"`);
console.time("bundle");
const serveUrl = fresh ? await bundle({ entryPoint: path.resolve("src/index_t30monees.tsx"), publicDir, outDir: B, onSymlinkDetected: () => {} }) : B;
console.timeEnd("bundle");
for (const d of ["img", "broll"]) {
  if (!fs.existsSync(J(d))) { fs.mkdirSync(`${B}/public/${d}`, { recursive: true }); execSync(`cmd /c mklink /J "${J(d)}" "${win(`D:/st_t30monees/pub/${d}/t30monees`)}"`); }
}
const composition = await selectComposition({ serveUrl, id: "Full", timeoutInMilliseconds: 180000, chromiumOptions: { gl: "angle" } });
for (const s of secs) {
  const f = Math.round(Number(s) * 30);
  try { await renderStill({ serveUrl, composition, frame: f, output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, chromiumOptions: { gl: "angle" }, scale: 0.5, timeoutInMilliseconds: 180000 }); console.log("ok", s); }
  catch (e) { console.log("ERR", s, String(e).slice(0, 400)); }
}
