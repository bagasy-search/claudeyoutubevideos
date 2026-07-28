// upload_assets_v2pd88ko0ud8.mjs — empaqueta y sube SOLO los assets como release
// assets-<slug>, sin disparar el render. Sirve para auditar con grid.mjs ANTES de
// gastar los 20-30 chunks (grid.mjs exige que el release ya exista).
//   node scripts/upload_assets_v2pd88ko0ud8.mjs
// Filtra por slug: public/img y public/broll son carpetas COMPARTIDAS entre videos.
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync, execSync } from "child_process";

const SLUG = "v2pd88ko0ud8";
const sh = (c) => execSync(c, { stdio: "inherit" });
const out = (c) => execSync(c, { encoding: "utf8" }).trim();

// ── qué entra al tar ─────────────────────────────────────────────────────────
const items = [];
const parse = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^[\s\S]*?=\s*/, "").replace(/;\s*$/, ""));
const refs = new Set();
for (const b of parse(`src/_fed6/VideoEdit/${SLUG}_beats.ts`)) {
  if (b.src) refs.add(b.src);
  if (b.image) refs.add(b.image);
  for (const it of b.items || []) if (it && it.image) { refs.add(it.image); refs.add(it.image.replace(/\.(png|jpg|jpeg|webp)$/i, "_blur.jpg")); }
}
for (const b of parse(`src/_fed6/VideoEdit/${SLUG}_broll.ts`)) refs.add(b.src);
items.push(`avatar_${SLUG}.mp4`);
// AvatarLayer deriva el wav del src (avatar_<slug>.mp4 → avatar_<slug>.wav) para el
// borde audio-reactive: sin ese archivo, TODOS los frames mueren con 404.
items.push(`avatar_${SLUG}.wav`);
for (const r of [...refs].sort()) {
  if (!fs.existsSync(path.join("public", r))) { console.error("✗ falta en disco:", r); process.exit(1); }
  items.push(r);
}
// COMPARTIDAS obligatorias: sin sfx el matrix cancela la corrida entera (ya pasó 3 veces)
if (!fs.existsSync("public/sfx")) { console.error("✗ FALTA public/sfx/ — sin ella el matrix cancela la corrida entera"); process.exit(1); }
items.push("sfx");
// med: SOLO las imágenes de default de los componentes. La carpeta entera pesa 882 MB
// por avatares de OTROS videos que este build no usa (y que hacen fallar la subida).
if (!fs.existsSync("public/med")) { console.error("✗ FALTA public/med/"); process.exit(1); }
for (const f of fs.readdirSync("public/med")) {
  if (/\.(png|jpe?g|webp)$/i.test(f) && fs.statSync(`public/med/${f}`).size < 4e6) items.push(`med/${f}`);
}

const tar = path.join(os.tmpdir(), `assets-${SLUG}.tar`);
const listFile = path.join(os.tmpdir(), `_ulist_${SLUG}.txt`);
fs.writeFileSync(listFile, items.join("\n"));
let tarArgs = ["-cf", tar, "-C", "public", "-T", listFile];
try { if (/GNU tar/i.test(execSync("tar --version", { encoding: "utf8" }))) tarArgs = ["--force-local", ...tarArgs]; } catch {}
console.log(`empaquetando ${items.length} entradas ...`);
execFileSync("tar", tarArgs, { stdio: "inherit" });
fs.rmSync(listFile);
console.log(`tar: ${(fs.statSync(tar).size / 1e6).toFixed(0)} MB`);

// ── subir ────────────────────────────────────────────────────────────────────
// `gh release upload` sobre un release existente da 404 con archivos grandes; lo que
// funciona es `gh release create <tag> <archivo>` en UN solo comando. Y un tag
// huérfano rompe TODAS las subidas siguientes → se borra el tag remoto antes.
const tag = `assets-${SLUG}`;
try { out(`gh release view ${tag}`); sh(`gh release delete ${tag} --yes --cleanup-tag`); } catch {}
try { sh(`git push origin :refs/tags/${tag}`); } catch {}
try { execSync(`git tag -d ${tag}`, { stdio: "ignore" }); } catch {}
sh(`gh release create ${tag} "${tar}" --title ${tag} --notes "assets del render ${SLUG}"`);
fs.rmSync(tar);

// verificar que quedó PUBLICADO (un release en draft es invisible para gh release download)
const info = JSON.parse(out(`gh release view ${tag} --json isDraft,assets`));
if (info.isDraft) { console.error("✗ el release quedó en DRAFT → los chunks van a decir 'release not found'"); process.exit(1); }
if (!info.assets || !info.assets.length) { console.error("✗ el release no tiene assets"); process.exit(1); }
console.log(`release ${tag} ✓ publicado · ${info.assets.map((a) => `${a.name} ${(a.size / 1e6).toFixed(0)}MB`).join(", ")}`);
