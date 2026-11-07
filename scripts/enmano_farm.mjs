// enmano_farm.mjs — CÁMARA EN MANO en el farm (7-nov-2026). La PC sólo sube, espera y pega: nada de CPU pesado acá.
//
//   node scripts/enmano_farm.mjs <slug> <avatar.mp4|foto.jpg> [más archivos...] [--out carpeta] [--trozo 12] [--k 1] [--dur 6] [--seed N]
//
//   video → se parte en trozos de --trozo s (1 runner por trozo), vuelve <nombre>_enmano.mp4 con el AUDIO original
//   foto  → <nombre>_enmano.mp4 de --dur s (sin audio)
// Por defecto deja los resultados al lado de cada entrada. --k = intensidad (1 = la calibrada; 0.7 más suave).
// La semilla sale del slug + nombre: cada video tiene su propio movimiento, y re-correrlo da el mismo resultado.
// Motor: scripts/enmano.py · workflow: .github/workflows/enmano.yml · release: enmano-<slug> (temporal).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const REPO = "bagasy-search/claudeyoutubevideos";
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf("--" + k); if (i < 0) return d; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const OUT = opt("out", ""), TROZO = +opt("trozo", 12), KK = +opt("k", 1), DUR = +opt("dur", 6), SEED = opt("seed", "");
const REF = opt("ref", "main");
const [slug, ...files] = argv;
if (!slug || !files.length) { console.error("Uso: node scripts/enmano_farm.mjs <slug> <archivo...> [--out dir] [--trozo 12] [--k 1] [--dur 6]"); process.exit(1); }
const gh = (args, o = {}) => execFileSync("gh", [...args, "-R", REPO], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...o });
const R = `enmano-${slug}`;
const esFoto = (f) => /\.(jpe?g|png|webp)$/i.test(f);
const limpio = (s) => s.replace(/[^A-Za-z0-9._-]/g, "_");
const semilla = (s) => SEED !== "" ? +SEED : parseInt(crypto.createHash("md5").update(s).digest("hex").slice(0, 6), 16);

try { gh(["release", "view", R]); } catch { gh(["release", "create", R, "--title", R, "--notes", "cámara en mano (temporales)"]); }

const tag = Date.now().toString(36);
const items = [], plan = [];
for (const f of files) {
  if (!fs.existsSync(f)) { console.error("no existe", f); process.exit(1); }
  const base = path.basename(f).replace(/\.[^.]+$/, ""), src = `${tag}_${limpio(path.basename(f))}`;
  const tmp = path.join(path.dirname(f), src); fs.copyFileSync(f, tmp);
  for (let n = 1; ; n++) { try { gh(["release", "upload", R, tmp, "--clobber"]); break; } catch (e) { if (n > 3) throw e; } }
  fs.unlinkSync(tmp);
  const seed = semilla(`${slug}/${base}`), dst = path.join(OUT || path.dirname(f), `${base}_enmano.mp4`);
  if (esFoto(f)) {
    const n = `${tag}_${limpio(base)}__f`;
    items.push({ n, src, desde: 0, frames: 0, seed, k: KK, dur: DUR }); plan.push({ f, dst, trozos: [n], foto: true });
  } else {
    const campos = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets,r_frame_rate", "-of", "csv=p=0", f], { encoding: "utf8" })
      .trim().split(",");
    const [num, den] = campos.find((c) => c.includes("/")).split("/").map(Number), total = +campos.find((c) => !c.includes("/"));
    const paso = Math.round(TROZO * num / den), trozos = [];
    for (let d = 0, i = 0; d < total; d += paso, i++) {
      const n = `${tag}_${limpio(base)}__${String(i).padStart(3, "0")}`;
      items.push({ n, src, desde: d, frames: Math.min(paso, total - d), seed, k: KK, dur: null }); trozos.push(n);
    }
    plan.push({ f, dst, trozos, foto: false });
  }
}
console.log(`enmano ${slug}: ${files.length} archivo(s) → ${items.length} trozo(s) en el farm`);
if (items.length > 256) { console.error("más de 256 trozos: subí --trozo"); process.exit(1); }
gh(["workflow", "run", "enmano.yml", "--ref", REF, "-f", "params=" + JSON.stringify({ slug, tag, items })]);

// esperar y bajar (sin gh run watch: quema el límite de la API)
const dir = fs.mkdtempSync(path.join(path.dirname(path.resolve(files[0])), ".enmano_"));
const hechos = new Set(), T0 = Date.now(), MAX = 90 * 60e3;
while (hechos.size < items.length && Date.now() - T0 < MAX) {
  await new Promise((r) => setTimeout(r, 30e3));
  let names = [];
  try { names = JSON.parse(gh(["release", "view", R, "--json", "assets", "-q", "[.assets[].name]"])); } catch { continue; }
  for (const it of items) {
    const a = `${it.n}.mp4`;
    if (hechos.has(it.n) || !names.includes(a)) continue;
    try { gh(["release", "download", R, "-p", a, "-D", dir, "--clobber"]); hechos.add(it.n); } catch {}
  }
  process.stdout.write(`\r  ${hechos.size}/${items.length} trozos listos · ${Math.round((Date.now() - T0) / 60e3)} min`);
}
console.log();
for (const p of plan) {
  const faltan = p.trozos.filter((n) => !hechos.has(n));
  if (faltan.length) { console.log(`✗ ${path.basename(p.f)}: faltan ${faltan.length} trozos (${faltan.slice(0, 3).join(", ")}…) — mirar la corrida en Actions`); continue; }
  if (p.foto) { fs.copyFileSync(path.join(dir, `${p.trozos[0]}.mp4`), p.dst); console.log(`✓ ${p.dst}`); continue; }
  const lista = path.join(dir, "lista.txt");
  fs.writeFileSync(lista, p.trozos.map((n) => `file '${path.join(dir, n + ".mp4").replace(/\\/g, "/")}'`).join("\n"));
  const cat = path.join(dir, "cat.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", cat]);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", cat, "-i", p.f, "-map", "0:v", "-map", "1:a?", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", p.dst]);
  console.log(`✓ ${p.dst}`);
}
fs.rmSync(dir, { recursive: true, force: true });
