// plan_limpieza2.mjs — SEGUNDA limpieza de D: (no borra nada): arma factory/_state/limpieza/limpieza_masiva2.ps1.
//   BORRAR   = restos regenerables con antigüedad: worktrees viejos del worker (>14 días), intermedios de render en
//              la raíz de D: (>7 días), carpetas de chunks/descargas/temporales (>7 días).
//   CONSULTAR = archivos grandes que pueden importar: se listan con tamaño, NO entran al script.
// Junctions: se sacan como LINK antes de borrar la carpeta (un node_modules/public por junction se pierde si no).
//   node factory/tools/plan_limpieza2.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "C:/Users/bauti/Downloads/video2";
const OUT = path.join(ROOT, "factory/_state/limpieza");
fs.mkdirSync(OUT, { recursive: true });
const DIA = 86400e3, ahora = Date.now();
const entregados = JSON.parse(fs.readFileSync("D:/rtmp/tmp/claude/bagasy_entregados.json", "utf8")).sort((a, b) => b.length - a.length);
const PROTEGIDOS = ["tcfiltro", "tcestufa", "farinon", "facrema81", "castorglove", "teamind60", "turkeyneck", "valcolageno", "nightwater60", "faojos60", "fa70estudios", "tcbriquetas"];
const esProtegido = (n) => PROTEGIDOS.some((s) => n.toLowerCase().startsWith(s));
const slugDe = (n) => entregados.find((s) => n.toLowerCase() === s || new RegExp(`^${s.replace(/[-]/g, "\\-")}([_.-]|\\d*[_.]|$)`).test(n.toLowerCase()));
const mb = (b) => Math.round(b / 1048576);
const nivel1 = new Map(fs.readFileSync("D:/rtmp/tmp/claude/d_inventario/nivel1.txt", "utf8").split(/\r?\n/).map((l) => l.split("\t")).filter((x) => x.length === 2).map(([m, p]) => [p.replace(/\/$/, "").toLowerCase(), Number(m)]));
const sizeDir = (d) => {
  const k = d.replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
  if (nivel1.has(k)) return nivel1.get(k);
  let b = 0;
  const walk = (x) => { let e = []; try { e = fs.readdirSync(x, { withFileTypes: true }); } catch { return; } for (const i of e) { const p = path.join(x, i.name); if (i.isSymbolicLink()) continue; if (i.isDirectory()) walk(p); else { try { b += fs.lstatSync(p).size; } catch { /* nada */ } } } };
  walk(d);
  return mb(b);
};

const borrar = [], consultar = [];
const add = (cat, p, tamMb, tipo, motivo) => borrar.push({ cat, path: p.replace(/\//g, "\\"), mb: tamMb, tipo, motivo });

// A. worktrees del worker en D:/Proyectos/video2-wt (>14 días)
for (const w of JSON.parse(fs.readFileSync("D:/rtmp/tmp/claude/d_inventario/video2wt.json", "utf8").replace(/^\uFEFF/, ""))) {
  const p = `D:/Proyectos/video2-wt/${w.nombre}`;
  const edad = (ahora - new Date(w.mtime).getTime()) / DIA;
  if (edad < 14 || esProtegido(w.nombre)) continue;
  add("A worktrees viejos del worker (D:/Proyectos/video2-wt, >14 días)", p, Math.round(w.gb * 1024), "worktree", `${Math.round(edad)} días`);
}

// B/C. raíz de D:
const INTERMEDIO = /\.(h264|delta\d*)$|\.tar\.part\d+$|^assets-.*\.tar$|_concat\.txt$|^pts[_\w]*\.txt$|^(y(high|low)\d*|tar_old|tar_viejo|lista_nueva|nuevos|chunks3|delta2|f5delta)\.txt$|\.(raw)$|^(step1b?|vid30|prueba_lag|comparacion_avatar|ls_cat|rg_all)\.mp4$|^tmp_ava_.*\.mp4$|^avatar_master_.*\.mp4$/i;
const DIRS_TEMP = /^(chunks[_-].+|.+_chunks\d*|cgchunks|dl_.+|_dl_.+|_dl|_dltest|dmstitch|_finalpx\d*|_lz\d*|_ectar|_farmtar|_farmtmp|farmtmp|tmp_farm|remotion_tmp|tmp_remotion|broll_tmp|match_tmp|ghtmp|rtemp|upload|deliver|entrega|entrega_.+|final|tar_v.+|_served|aud\d*|aud_.+|oxscan\d*|_c_v51|_chk_.+|_cad|_qr|_md(aud|drift|pc)|_aud|apamole_.+|chapa_audit|rksafe_test|_final_v51|_lobos_new|_avatar_src_.+|bak_png_.+|chunks-.+|.+_respaldo)$/i;
const PEDIR = /^(video2_archivo|video2_archive|video2_archive_opt|video2_offload|video2_fish_out_archivo|video2_assets|video2_broll_archive|video2_fuentes|AvatarLab|avatares_viejos|_respaldo_c|bagasy-recovery|public_movido_desde_C|restore|tmp|tmp2|vac|vvm|s78|rksafe|rkbill|cog_work|tn_work|CodexMedia|CodexWorktrees)$/i;
const NUNCA = /^(\$RECYCLE\.BIN|System Volume Information|Recovery|AI|Proyectos|Codex|claude-brain|rtmp|rtmp_clips|videosdeclaude|Videos|VideosClaude|_v3|ADFLUX APP FLUTTER|AppDiseño.*|AppTCGCardsScann|CodexAgentarium.*)$/i;
for (const e of fs.readdirSync("D:/", { withFileTypes: true })) {
  const p = `D:/${e.name}`;
  let st; try { st = fs.lstatSync(p); } catch { continue; }
  const edad = (ahora - st.mtimeMs) / DIA;
  if (NUNCA.test(e.name) || esProtegido(e.name)) continue;
  if (e.isDirectory()) {
    if (PEDIR.test(e.name)) { consultar.push({ path: p, mb: sizeDir(p), motivo: "archivo/entorno: decidir" }); continue; }
    if (DIRS_TEMP.test(e.name) && edad >= 7) add("C carpetas de chunks, descargas y temporales en la raíz de D: (>7 días)", p, sizeDir(p), "dir", `${Math.round(edad)} días`);
    continue;
  }
  if (edad < 7) continue;
  const s = slugDe(e.name);
  if (INTERMEDIO.test(e.name)) add("B intermedios de render en la raíz de D: (.h264, pedazos de tar, pts, concat; >7 días)", p, mb(st.size), "file", s ? `de ${s}` : "intermedio");
  else if (/\.(mp4|wav|m4a)$/i.test(e.name) && s) add("B intermedios de render en la raíz de D: (.h264, pedazos de tar, pts, concat; >7 días)", p, mb(st.size), "file", `copia/intermedio de ${s} (entregado)`);
  else if (/\.(zip|mp4|exe)$/i.test(e.name) && st.size > 100e6) consultar.push({ path: p, mb: mb(st.size), motivo: "archivo suelto grande sin video asociado" });
}
// D. grandes dentro de rtmp / AI / videosdeclaude que conviene decidir
for (const p of ["D:/rtmp/pod-real-proxy", "D:/rtmp/reppo-models", "D:/rtmp/_dl_backup", "D:/rtmp/public_root_backup", "D:/rtmp/pod-archive", "D:/rtmp/public_wav_backup", "D:/rtmp/public_opt_backup", "D:/AI/ditto-test", "D:/AI/ollama-models", "D:/AI/restorenv", "D:/AI/pip-cache", "D:/videosdeclaude/_opt_archive", "D:/videosdeclaude/bastida_ckpt"]) {
  if (fs.existsSync(p)) consultar.push({ path: p, mb: sizeDir(p), motivo: "backup/modelo/entorno: decidir" });
}

const porCat = {};
for (const a of borrar) { porCat[a.cat] ??= { n: 0, mb: 0 }; porCat[a.cat].n++; porCat[a.cat].mb += a.mb; }
const L = ["== SE BORRA (regenerable, con antigüedad) =="];
for (const [c, v] of Object.entries(porCat).sort()) L.push(`  ${c.padEnd(92, ".")} ${String(v.n).padStart(4)} · ${(v.mb / 1024).toFixed(1).padStart(6)} GB`);
L.push(`  TOTAL ${(borrar.reduce((x, a) => x + a.mb, 0) / 1024).toFixed(1)} GB`, "", "== TE CONSULTO (no está en el script) ==");
for (const c of consultar.sort((a, b) => b.mb - a.mb)) L.push(`  ${(c.mb / 1024).toFixed(1).padStart(6)} GB  ${c.path}  (${c.motivo})`);
L.push(`  TOTAL consultable ${(consultar.reduce((x, a) => x + a.mb, 0) / 1024).toFixed(1)} GB`);
fs.writeFileSync(path.join(OUT, "resumen2.txt"), L.join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "plan2.json"), JSON.stringify({ borrar, consultar }, null, 1));

const q = (p) => "'" + p.replace(/'/g, "''") + "'";
const P = [
  "# limpieza_masiva2.ps1 — GENERADO por factory/tools/plan_limpieza2.mjs. Rutas explícitas.",
  "$ErrorActionPreference = 'Continue'",
  "$antesD = (Get-PSDrive D).Free; $script:n = 0; $script:err = 0",
  "function SacarJunctions($d) { if (Test-Path -LiteralPath $d -PathType Container) { Get-ChildItem -LiteralPath $d -Recurse -Force -Attributes ReparsePoint -ErrorAction SilentlyContinue | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object { cmd /c rmdir \"$($_.FullName)\" | Out-Null } } }",
  "function QuedanJunctions($d) { (Get-ChildItem -LiteralPath $d -Recurse -Force -Attributes ReparsePoint -ErrorAction SilentlyContinue | Measure-Object).Count }",
  "function Borrar($p) { if (Test-Path -LiteralPath $p) { $it = Get-Item -LiteralPath $p -Force; if ($it.PSIsContainer) { SacarJunctions $p; if ((QuedanJunctions $p) -gt 0) { Write-Host \"SALTEO (quedan junctions): $p\"; $script:err++; return } }; Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue; if (Test-Path -LiteralPath $p) { $script:err++ } else { $script:n++ } } }",
];
for (const a of borrar) P.push(`Borrar ${q(a.path)}`);
P.push("git -C 'C:\\Users\\bauti\\Downloads\\video2' worktree prune");
P.push("Write-Host (\"Listo: {0} borrados, {1} salteados/no se pudieron. Liberado en D: {2:N1} GB. Libre ahora D: {3:N1} GB\" -f $script:n, $script:err, (((Get-PSDrive D).Free - $antesD)/1GB), ((Get-PSDrive D).Free/1GB))");
fs.writeFileSync(path.join(OUT, "limpieza_masiva2.ps1"), "\uFEFF" + P.join("\r\n") + "\r\n");
console.log(L.join("\n"));
console.log(`\nscript: ${path.join(OUT, "limpieza_masiva2.ps1")} (${borrar.length} rutas)`);
