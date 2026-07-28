// upload_assets_v89y5o7w2nz6.mjs — empaqueta y sube SOLO los assets como release assets-<slug>,
// sin disparar el render. Necesario para poder auditar con grid.mjs ANTES de gastar el render.
// Replica los pasos 1-2 de farm.mjs con la lista explícita _<slug>_assets.txt.
import fs from "fs";
import { execSync, execFileSync } from "child_process";
const SLUG = "v89y5o7w2nz6";
const sh = (c) => execSync(c, { stdio: "inherit" });
const tarDir = process.env.TAR_DIR || "D:/rtmp";
fs.mkdirSync(tarDir, { recursive: true });
const tar = `${tarDir}/assets-${SLUG}.tar`;

const explicit = fs.readFileSync(`_${SLUG}_assets.txt`, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
if (!fs.existsSync("public/sfx")) { console.error("✗ falta public/sfx"); process.exit(1); }
const items = [...new Set([...explicit, "sfx", ...(fs.existsSync("public/med") ? fs.readdirSync("public/med").filter((f)=>fs.statSync("public/med/"+f).size < 30e6).map((f)=>"med/"+f) : [])])];
const faltan = items.filter((p) => !fs.existsSync("public/" + p));
if (faltan.length) { console.error("✗ faltan en public/:", faltan.slice(0, 10)); process.exit(1); }

const listFile = `_tarlist_${SLUG}.txt`;
fs.writeFileSync(listFile, items.join("\n"));
let tarArgs = ["-cf", tar, "-C", "public", "-T", listFile];
try { if (/GNU tar/i.test(execSync("tar --help", { encoding: "utf8" }))) tarArgs = ["--force-local", ...tarArgs]; } catch {}
execFileSync("tar", tarArgs, { stdio: "inherit" });
fs.rmSync(listFile);
console.log(`tar: ${(fs.statSync(tar).size / 1048576).toFixed(0)} MB · ${items.length} entradas`);

const relTag = `assets-${SLUG}`;
try { execSync(`gh release view ${relTag}`, { stdio: "pipe" }); sh(`gh release delete ${relTag} --yes --cleanup-tag`); } catch {}
try { sh(`git push origin :refs/tags/${relTag}`); } catch {}   // tag huérfano rompe TODAS las subidas siguientes
try { execSync(`git tag -d ${relTag}`, { stdio: "pipe" }); } catch {}
sh(`gh release create ${relTag} ${tar} --title ${relTag} --notes "assets del render"`);
const view = execSync(`gh release view ${relTag} --json isDraft,assets`, { encoding: "utf8" });
console.log("release:", view.slice(0, 300));
if (JSON.parse(view).isDraft) { console.error("⛔ el release quedó en DRAFT → gh release download no lo ve"); process.exit(1); }
fs.rmSync(tar);
console.log("✓ assets subidos y visibles");
