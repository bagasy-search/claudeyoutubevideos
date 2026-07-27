// upload_assets_v8v252t7cjxe.mjs — empaqueta y sube SOLO los assets, sin disparar el render.
// Por qué existe: `grid.mjs` (la cuadrícula del AUDITOR) necesita el release `assets-<slug>` ya
// subido, pero el único script que lo sube es `farm.mjs`, que además dispara el render completo.
// O sea que para auditar ANTES de rendear había que rendear primero — justo lo contrario del punto
// de la cuadrícula (1 job de auditoría vs ~20 de render). Esto hace nada más la parte de la subida.
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SLUG = "v8v252t7cjxe";
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

const tarDir = process.env.TAR_DIR || ".";
const tar = `${tarDir}/assets-${SLUG}.tar`;

// mismas entradas que farm.mjs, relativas a public/ (el workflow extrae con -C public)
const items = [];
if (fs.existsSync(`public/${SLUG}_opt.mp4`)) items.push(`${SLUG}_opt.mp4`);
if (fs.existsSync(`public/${SLUG}.wav`)) items.push(`${SLUG}.wav`);
// ⛔ sfx NO es opcional: varios componentes del kit piden un .mp3 de public/sfx y si no está el
// render tira 404 y MUERE el chunk (pasó: 15 de 20 chunks caídos por sfx_whoosh_soft.mp3). En un
// worktree nuevo la carpeta NO existe, porque public/ está gitignored y no viaja con la rama:
// hay que copiarla del repo base. Por eso acá se corta ANTES de subir, en vez de avisar y seguir.
if (!fs.existsSync("public/sfx")) {
  console.error("⛔ falta public/sfx — copiala del repo base:  cp -r <repo>/public/sfx public/sfx");
  process.exit(1);
}
items.push("sfx");
if (fs.existsSync(`public/avatar_clips/${SLUG}`)) items.push(`avatar_clips/${SLUG}`);

// SOLO los assets de ESTE slug: public/img y public/broll son carpetas COMPARTIDAS entre videos.
// Meterlas enteras subiría cientos de MB de otros videos y podría pasarse del tope de 2 GB.
for (const d of ["img", "broll"]) {
  if (!fs.existsSync(`public/${d}`)) continue;
  for (const f of fs.readdirSync(`public/${d}`)) if (f.includes(SLUG)) items.push(`${d}/${f}`);
}

const listFile = path.join(os.tmpdir(), `_assets_${SLUG}.txt`);
fs.writeFileSync(listFile, items.join("\n"));
console.log(`empaquetando ${items.length} entradas → ${tar} ...`);
let tarArgs = ["-cf", tar, "-C", "public", "-T", listFile];
try { if (/GNU tar/i.test(execSync("tar --version", { encoding: "utf8" }))) tarArgs = ["--force-local", ...tarArgs]; } catch {}
execFileSync("tar", tarArgs, { stdio: "inherit" });
fs.rmSync(listFile);

const mb = fs.statSync(tar).size / 1048576;
console.log(`tarball: ${mb.toFixed(0)} MB`);
if (mb > 1900) { console.error("⛔ pasa el tope de 2 GB del release — comprimí más antes de subir"); process.exit(1); }

const relTag = `assets-${SLUG}`;
try { out(`gh release view ${relTag}`); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch { /* no existe */ }
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "assets del render"`);
fs.rmSync(tar);

// VERIFICAR que quedó descargable (gotcha conocido: el upload devuelve 200 y el asset no está)
const size = out(`gh release view ${relTag} --json assets --jq ".assets[0].size"`);
console.log(`✓ release ${relTag} subido y verificado · ${(+size / 1048576).toFixed(0)} MB`);
