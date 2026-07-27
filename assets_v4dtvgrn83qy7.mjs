// assets_v4dtvgrn83qy7.mjs — empaqueta y sube SOLO los assets (release assets-<slug>), sin rendear.
// Existe porque la cuadrícula de auditoría (scripts/grid.mjs) necesita el release ya subido, y
// farm.mjs no tiene un modo "solo assets": dispararlo entero rendearía los 20 chunks antes de auditar.
// Misma lógica de empaquetado que scripts/farm.mjs (modo prefijo), acotada a este slug.
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const slug = "v4dtvgrn83qy7";
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

const tarDir = process.env.TAR_DIR || ".";
const tar = `${tarDir}/assets-${slug}.tar`;
const avatar = `public/${slug}_opt.mp4`;
const wav = `public/${slug}.wav`;
for (const f of [avatar, wav]) if (!fs.existsSync(f)) { console.error("falta:", f); process.exit(1); }

const items = [`${slug}_opt.mp4`, `${slug}.wav`];
if (fs.existsSync("public/sfx")) items.push("sfx");           // 52 componentes del kit montan SfxCue
else console.warn("⚠ sin public/sfx — los componentes con SfxCue van a dar 404 en el farm");

// imágenes de este video: los .jpg servidos + los _blur.jpg que ImageBackdrop DERIVA en runtime
// (ese nombre no aparece en los cues, por eso hay que sumarlo a mano o los 20 chunks se caen juntos)
// Los .png ORIGINALES se quedan en disco (son assets pagos) pero NO viajan: el cues sirve los .jpg
// y los 20 jobs bajan el tarball entero cada uno — 350 MB de PNG que nadie lee son 7 GB de tránsito.
const img = fs.readdirSync("public/img")
  .filter((f) => f.startsWith(slug) || f.startsWith(`dg_${slug}`))
  .filter((f) => !f.endsWith(".png"));
items.push(...img.map((f) => `img/${f}`));
// clips de stock, aislados por slug
if (fs.existsSync(path.join("public/broll", slug))) items.push(`broll/${slug}`);

const listFile = path.join(os.tmpdir(), `_assets_${slug}.txt`);
fs.writeFileSync(listFile, items.join("\n"));
console.log(`empaquetando ${items.length} entradas (${img.length} imágenes) → ${tar} ...`);

let tarArgs = ["-cf", tar, "-C", "public", "-T", listFile];
try { if (/GNU tar/i.test(execSync("tar --version", { encoding: "utf8" }))) tarArgs = ["--force-local", ...tarArgs]; } catch { /* bsdtar */ }
execFileSync("tar", tarArgs, { stdio: "inherit" });
fs.rmSync(listFile);
const mb = (fs.statSync(tar).size / 1048576).toFixed(0);
console.log(`tarball: ${mb} MB`);
if (mb > 1900) { console.error("✖ tarball >1.9 GB — GitHub rechaza releases de 2 GB. Recomprimí más."); process.exit(1); }

const relTag = `assets-${slug}`;
try { out(`gh release view ${relTag}`); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "assets del render"`);
fs.rmSync(tar);

// verificar que quedó DESCARGABLE antes de decir que está listo (gotcha: 422/404 silencioso)
const url = out(`gh release view ${relTag} --json assets --jq ".assets[0].url"`);
console.log("release subido ·", url ? "asset presente ✓" : "⚠ sin asset");
