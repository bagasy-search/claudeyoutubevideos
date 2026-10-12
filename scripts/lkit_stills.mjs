// lkit · un still por componente de la galería (empaqueta UNA vez) + hoja de contacto.
// node scripts/lkit_stills.mjs [Nombre ...]   → out/lkit/<Nombre>.png  y  out/lkit_gallery.jpg (ffmpeg tile)
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const out = path.join(root, "out", "lkit");
fs.mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);

const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index_lkit.tsx"), publicDir: path.join(root, "public"), outDir: path.join(out, "_bundle") }); // fuera de TEMP: hay limpiezas que borran remotion-* en tmp
const comps = (await getCompositions(serveUrl)).filter((c) => c.id.startsWith("G-"));
const src = fs.readFileSync(path.join(root, "src", "lkit", "Gallery.tsx"), "utf8");
const stillOf = (name) => { const m = src.match(new RegExp(`name: "${name}", dur: [\\d.]+, still: ([\\d.]+)`)); return m ? +m[1] : 2; };
const names = [];
for (const c of comps) {
  const name = c.id.slice(2);
  names.push(name);
  if (only.length && !only.includes(name)) continue;
  const frame = Math.min(c.durationInFrames - 1, Math.round(stillOf(name) * 30));
  for (let k = 0; k < 3; k++) {
    try { await renderStill({ composition: c, serveUrl, output: path.join(out, `${name}.png`), frame, overwrite: true }); break; }
    catch (e) { console.log("reintento", name, String(e.message || e).slice(0, 120)); if (k === 2) throw e; }
  }
  console.log("ok", name, frame);
}
// hoja de contacto con el nombre de cada componente
const lab = path.join(out, "_lab"); fs.mkdirSync(lab, { recursive: true });
names.forEach((n, i) => {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(out, `${n}.png`), "-vf",
    `scale=640:360,pad=640:394:0:34:black,drawtext=text='${String(i + 1).padStart(2, "0")} ${n}':x=10:y=7:fontsize=22:fontcolor=white:fontfile='C\\:/Windows/Fonts/arial.ttf'`,
    path.join(lab, `${String(i).padStart(2, "0")}.png`)]);
});
const cols = 5, rows = Math.ceil(names.length / cols);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(lab, "%02d.png"), "-vf", `tile=${cols}x${rows}:padding=6:margin=6`, "-frames:v", "1", "-q:v", "3", path.join(root, "out", "lkit_gallery.jpg")]);
console.log("hoja:", path.join(root, "out", "lkit_gallery.jpg"));
