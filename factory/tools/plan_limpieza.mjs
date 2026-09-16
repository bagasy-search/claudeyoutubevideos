// plan_limpieza.mjs — arma la LIMPIEZA MASIVA (no borra nada): clasifica disco contra los videos ENTREGADOS en
// Bagasy y escribe factory/_state/limpieza/limpieza_masiva.ps1 con rutas EXPLÍCITAS + resumen por categoría.
// Protege: videos en curso / a rehacer, cualquier cosa modificada en las últimas 48 h, y los JUNCTIONS se borran
// como LINK (nunca se recorre su interior: así se perdió el public/ real una vez).
//   node factory/tools/plan_limpieza.mjs   (necesita D:/rtmp/tmp/claude/{bagasy_entregados,inventario_disco}.json)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = "C:/Users/bauti/Downloads/video2";
const OUT = path.join(ROOT, "factory/_state/limpieza");
fs.mkdirSync(OUT, { recursive: true });
const entregados = new Set(JSON.parse(fs.readFileSync("D:/rtmp/tmp/claude/bagasy_entregados.json", "utf8")));
const PROTEGIDOS = new Set(["tcfiltro", "tcestufa", "farinon", "facrema81", "castorglove", "factory"]);
const HORAS = 48, ahora = Date.now();
const reciente = (mtimeStr) => ahora - new Date(mtimeStr.replace(" ", "T")).getTime() < HORAS * 3600e3;
const slugs = [...entregados].filter((s) => !PROTEGIDOS.has(s)).sort((a, b) => b.length - a.length);
const slugDe = (name) => {
  const n = name.replace(/^wt-/, "").replace(/^_entrega_/, "").replace(/^assets-/, "").toLowerCase();
  return slugs.find((s) => n === s || n.startsWith(s + "_") || n.startsWith(s + "-") || n.startsWith(s + "."));
};
// tamaño en el mismo proceso (un PowerShell por carpeta era lentísimo con cientos de perfiles de Chrome);
// lstat: los junctions se ven como symlink y NO se recorren
const sizeMb = (dir) => {
  let b = 0;
  const walk = (d) => {
    let ents = [];
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) walk(p);
      else { try { b += fs.lstatSync(p).size; } catch { /* nada */ } }
    }
  };
  walk(dir);
  return Math.round(b / 1048576);
};

const inv = JSON.parse(fs.readFileSync("D:/rtmp/tmp/claude/inventario_disco.json", "utf8").replace(/^\uFEFF/, ""));
const acc = [];
let recientesMb = 0;
for (const r of inv) {
  const s = slugDe(r.name);
  if (!s) continue;
  const full = path.join(r.base, r.name);
  if (reciente(r.mtime)) { recientesMb += r.mb; continue; }
  const cat = r.base.includes("public\\img") ? "1 imágenes de videos entregados (public/img)"
    : r.base.includes("public\\broll") ? "2 b-roll y avatar de videos entregados (public/broll)"
    : r.name.startsWith("wt-") ? "4 worktrees de render de videos entregados (D:/rtmp/wt-*)"
    : "3 trabajo intermedio de videos entregados (D:/rtmp)";
  if (r.junction) {
    const t = r.target;
    if (t && t.toLowerCase().includes(s)) acc.push({ cat, path: full, mb: fs.existsSync(t) ? sizeMb(t) : 0, tipo: "junction", target: t, slug: s });
    continue;   // junction a un destino que no es del video: no se toca
  }
  acc.push({ cat, path: full, mb: r.mb, tipo: r.dir ? "dir" : "file", slug: s });
}
// tars de assets de renders (regenerables desde public/)
for (const f of fs.readdirSync("D:/")) {
  if (!/^assets-.*\.tar$/.test(f)) continue;
  const st = fs.statSync("D:/" + f);
  if (ahora - st.mtimeMs < HORAS * 3600e3) { recientesMb += st.size / 1048576; continue; }
  acc.push({ cat: "5 tars de assets ya subidos al farm (D:/assets-*.tar)", path: "D:\\" + f, mb: Math.round(st.size / 1048576), tipo: "file" });
}
// copias locales de finales de videos entregados (el mp4 vive en su release de GitHub)
for (const f of fs.readdirSync("D:/videosdeclaude")) {
  if (!/\.mp4$/.test(f)) continue;
  const s = slugDe(f.replace(/\.mp4$/, ""));
  if (!s) continue;
  const st = fs.statSync("D:/videosdeclaude/" + f);
  if (ahora - st.mtimeMs < HORAS * 3600e3) continue;
  acc.push({ cat: "6 copias LOCALES de videos ya publicados en su release (D:/videosdeclaude)", path: "D:\\videosdeclaude\\" + f, mb: Math.round(st.size / 1048576), tipo: "file", slug: s });
}
// cachés de Remotion / webpack / Chrome headless (se regeneran solos; se saltea lo tocado en las últimas 6 h)
const cacheDirs = ["C:/Users/bauti/Downloads/video2/node_modules/.cache/webpack"];
for (const base of ["D:/rtmp/tmp", process.env.TEMP || "C:/Users/bauti/AppData/Local/Temp"]) {
  try { for (const d of fs.readdirSync(base)) if (/^(puppeteer_dev_chrome_profile-|remotion-|react-motion-|remotion_)/.test(d)) cacheDirs.push(path.join(base, d)); } catch { /* nada */ }
}
for (const d of cacheDirs) {
  try {
    const st = fs.statSync(d);
    if (ahora - st.mtimeMs < 6 * 3600e3) continue;
    acc.push({ cat: "0 cachés de Remotion / webpack / Chrome headless", path: path.normalize(d), mb: sizeMb(path.normalize(d)), tipo: "dir" });
  } catch { /* nada */ }
}

const porCat = {};
for (const a of acc) { porCat[a.cat] ??= { n: 0, mb: 0 }; porCat[a.cat].n++; porCat[a.cat].mb += a.mb; }
const total = acc.reduce((x, a) => x + a.mb, 0);
const L = [`videos entregados en Bagasy: ${entregados.size} · protegidos: ${[...PROTEGIDOS].join(", ")}`];
for (const [c, v] of Object.entries(porCat).sort()) L.push(`  ${c.padEnd(82, ".")} ${String(v.n).padStart(5)} items ${(v.mb / 1024).toFixed(1).padStart(6)} GB`);
L.push(`  TOTAL a liberar ${(total / 1024).toFixed(1)} GB · NO se toca (modificado en las últimas ${HORAS} h): ${(recientesMb / 1024).toFixed(1)} GB`);
fs.writeFileSync(path.join(OUT, "resumen.txt"), L.join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "plan.json"), JSON.stringify(acc, null, 1));

const q = (p) => "'" + p.replace(/'/g, "''") + "'";
const P = [
  "# limpieza_masiva.ps1 — GENERADO por factory/tools/plan_limpieza.mjs. Rutas explícitas, sin comodines.",
  "# Junctions: primero se saca el LINK (cmd rmdir sin /s: no entra al destino); después se borra el destino del mismo video.",
  "$ErrorActionPreference = 'Continue'",
  "$antesC = (Get-PSDrive C).Free; $antesD = (Get-PSDrive D).Free; $script:n = 0; $script:err = 0",
  "function Borrar($p) { if (Test-Path -LiteralPath $p) { $it = Get-Item -LiteralPath $p -Force; if ($it.Attributes -band [IO.FileAttributes]::ReparsePoint) { cmd /c rmdir \"$p\" | Out-Null } else { Remove-Item -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue }; if (Test-Path -LiteralPath $p) { $script:err++ } else { $script:n++ } } }",
  "function SacarJunctionsAdentro($d) { if (Test-Path -LiteralPath $d -PathType Container) { Get-ChildItem -LiteralPath $d -Recurse -Force -Attributes ReparsePoint -ErrorAction SilentlyContinue | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object { cmd /c rmdir \"$($_.FullName)\" | Out-Null } } }",
];
for (const a of acc) {
  if (a.tipo === "junction") { P.push(`Borrar ${q(a.path)}`); P.push(`SacarJunctionsAdentro ${q(a.target)}; Borrar ${q(a.target)}`); }
  else if (a.tipo === "dir") P.push(`SacarJunctionsAdentro ${q(a.path)}; Borrar ${q(a.path)}`);
  else P.push(`Borrar ${q(a.path)}`);
}
P.push("git -C 'C:\\Users\\bauti\\Downloads\\video2' worktree prune");
P.push("$lib = (((Get-PSDrive C).Free - $antesC) + ((Get-PSDrive D).Free - $antesD)) / 1GB");
P.push("Write-Host (\"Listo: {0} borrados, {1} no se pudieron. Liberado: {2:N1} GB. Libre ahora C: {3:N1} GB, D: {4:N1} GB\" -f $script:n, $script:err, $lib, ((Get-PSDrive C).Free/1GB), ((Get-PSDrive D).Free/1GB))");
fs.writeFileSync(path.join(OUT, "limpieza_masiva.ps1"), "\uFEFF" + P.join("\r\n") + "\r\n");
console.log(L.join("\n"));
console.log(`script: ${path.join(OUT, "limpieza_masiva.ps1")} (${acc.length} rutas)`);
