// batch_render.mjs -- lanzar el render de UN video de forma SEGURA para correr 5-8 en paralelo.
//
//   node scripts/batch_render.mjs <slug> <comp> <total_frames> [ @lista_assets | prefijo ]
//   ej: node scripts/batch_render.mjs aloebrazo Aloebrazo 36080 @_aloebrazo_assets.txt
//
// Qué hace, y por qué es seguro con muchas sesiones a la vez:
//   1) BACKUP: copia public/<slug>.wav y public/<slug>_meta.json a _v3/ (fuera del junction).
//   2) DISCO: si C: tiene poco libre, corre la limpieza de PNG redundantes.
//   3) RAMA POR-SLUG: arma refs/heads/<slug>-render por PLUMBING desde origin/molino-v1 + los
//      archivos del video (src/<slug>/** e src/index_<slug>.tsx). USA UN INDICE TEMPORAL
//      (GIT_INDEX_FILE) => NO toca el índice ni el HEAD compartido => cero choque entre sesiones.
//      (El default del farm sincroniza molino-v1, que con 5-8 sesiones se pisan el código.)
//   4) CHUNKS = 60 / (renders activos + 1): reparte los 60 slots de GitHub Team entre los videos
//      en curso, así corren EN PARALELO en vez de en fila (el candado del farm serializa 60-chunk).
//   5) WORKTREE aislado en D:\rtmp\wt-<slug> con junctions a public/ y node_modules (via
//      safe_junction.ps1, que nunca borra el target real), y lanza el farm ahí (HEAD==<slug>-render,
//      así pasa el pre-vuelo). No modifica farm.mjs: lo ENVUELVE.
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const [slug, comp, total, pref] = process.argv.slice(2);
if (!slug || !comp || !total) {
  console.error("Uso: node scripts/batch_render.mjs <slug> <comp> <total_frames> [@lista|prefijo]");
  process.exit(1);
}
const REPO = "C:/Users/bauti/Downloads/video2";
const sh = (cmd, opts = {}) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts }).trim();
const shq = (cmd) => { try { return sh(cmd); } catch { return ""; } };
const log = (m) => console.log(m);

// ---- 1) BACKUP máster + meta a _v3/ ----
fs.mkdirSync(`${REPO}/_v3/audio`, { recursive: true });
for (const [src, dst] of [
  [`public/${slug}.wav`, `_v3/audio/${slug}.wav`],
  [`public/${slug}_meta.json`, `_v3/${slug}_meta.json`],
]) {
  if (fs.existsSync(`${REPO}/${src}`)) { fs.copyFileSync(`${REPO}/${src}`, `${REPO}/${dst}`); log(`  backup ${src} -> ${dst}`); }
}

// ---- 2) DISCO ----
try {
  const free = Number(shq(`powershell -NoProfile -Command "(Get-PSDrive C).Free"`)) || 0;
  const freeGB = free / 1e9;
  log(`  C: libre ${freeGB.toFixed(1)} GB`);
  if (freeGB < 4) { log("  C: bajo -> limpio PNG redundantes"); shq(`node scripts/clean_public.mjs --apply`); }
} catch {}

// ---- 3) RAMA <slug>-render por plumbing con INDICE TEMPORAL (no toca el índice compartido) ----
const entry = `src/index_${slug}.tsx`;
if (!fs.existsSync(`${REPO}/${entry}`)) { console.error(`✗ falta ${entry}`); process.exit(1); }
const files = [];
const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) {
  const p = path.join(d, f.name); f.isDirectory() ? walk(p) : files.push(p.replace(/\\/g, "/")); } };
if (fs.existsSync(`${REPO}/src/${slug}`)) walk(`${REPO}/src/${slug}`);
files.push(`${REPO}/${entry}`);
const rel = files.map((f) => f.replace(REPO + "/", ""));

const base = sh(`git rev-parse origin/molino-v1`);
const idx = path.join(os.tmpdir(), `bidx_${slug}_${total}.idx`);
const env = { ...process.env, GIT_INDEX_FILE: idx };
try { fs.rmSync(idx, { force: true }); } catch {}
execSync(`git read-tree ${base}`, { env });
for (const r of rel) {
  const h = sh(`git hash-object -w "${r}"`);
  execSync(`git update-index --add --cacheinfo 100644,${h},"${r}"`, { env });
}
const tree = execSync(`git write-tree`, { env, encoding: "utf8" }).trim();
const commit = sh(`git commit-tree ${tree} -p ${base} -m "batch-render ${slug}"`);
sh(`git update-ref refs/heads/${slug}-render ${commit}`);
try { fs.rmSync(idx, { force: true }); } catch {}
sh(`git push -f origin ${slug}-render`);
log(`  rama ${slug}-render = ${commit.slice(0, 8)} (índice compartido intacto)`);

// ---- 4) CHUNKS = 60 / (renders activos + 1) ----
let activos = 0;
try {
  const runs = JSON.parse(shq(`gh run list --limit 40 --json status,headBranch`) || "[]");
  const set = new Set(runs.filter((r) => /-render$/.test(r.headBranch || "") && ["in_progress", "queued", "waiting"].includes(r.status) && r.headBranch !== `${slug}-render`).map((r) => r.headBranch));
  activos = set.size;
} catch {}
const N = activos + 1;
const chunks = Math.max(8, Math.min(60, Math.floor(60 / N)));
log(`  renders activos: ${activos} -> N=${N} -> chunks=${chunks}`);

// ---- 5) WORKTREE + junctions + farm ----
const wt = `D:/rtmp/wt-${slug}`;
shq(`git worktree add -f "${wt}" ${slug}-render`) || shq(`git -C "${wt}" reset --hard ${slug}-render`);
for (const [d] of [["public"], ["node_modules"]]) {
  spawnSync("powershell", ["-NoProfile", "-File", "scripts/safe_junction.ps1", "add", `${wt.replace(/\//g, "\\")}\\${d}`, `${REPO.replace(/\//g, "\\")}\\${d}`], { stdio: "inherit" });
}
if (pref && pref.startsWith("@")) {
  const listFile = pref.slice(1);
  if (fs.existsSync(`${REPO}/${listFile}`)) fs.copyFileSync(`${REPO}/${listFile}`, `${wt}/${listFile}`);
}
log(`\n▶ farm: ${slug} ${comp} ${total} chunks=${chunks} ref=${slug}-render`);
const r = spawnSync("node", ["scripts/farm.mjs", slug, comp, total, String(chunks), pref || ""].filter(Boolean), {
  cwd: wt, stdio: "inherit",
  env: { ...process.env, ENTRY: entry, FARM_REF: `${slug}-render`, TAR_DIR: "D:" },
});
process.exit(r.status || 0);
