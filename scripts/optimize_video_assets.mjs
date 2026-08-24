// optimize_video_assets.mjs — deja los assets de video LISTOS PARA SEEK.
//
// POR QUE EXISTE (medido en valeriapresion, ago 2026):
//   agnes devuelve clips con UN keyframe cada 97 frames y el avatar de HeyGen trae uno cada 250.
//   <OffthreadVideo> pide los frames de a UNO, asi que para dibujar un cuadro del medio de un GOP
//   ffmpeg tiene que decodificar todo el GOP desde su keyframe: ~48 frames por cuadro en los clips
//   y ~125 en el avatar. Ese multiplicador convirtio un render de 20 min en uno de 2h40.
//
//   Re-encodear a GOP 10 cuesta +36% de peso y baja el costo de seek ~10x. El avatar ademas queda
//   MAS CHICO (venia en CRF 20 a 12 Mbps).
//
// Ademas: saca el audio (los clips van muteados en el kit, no se usa nunca) y fija 1920x1080
// exacto (agnes devuelve 1088 y si no se reescala en CADA frame).
//
// Uso:  node scripts/optimize_video_assets.mjs <prefijo> [avatar.mp4] [--gop 10] [--crf 21]
//   ej: node scripts/optimize_video_assets.mjs vp_ public/valeriapresion_opt.mp4
//
// Es IDEMPOTENTE: guarda un registro y saltea lo ya optimizado. Nunca borra el original hasta
// que el reemplazo existe y es valido (encode a .tmp + rename atomico).
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";

const args = process.argv.slice(2);
const pfx = args.find((a) => !a.startsWith("-") && !a.endsWith(".mp4"));
const avatar = args.find((a) => a.endsWith(".mp4"));
const flag = (n, def) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? +args[i + 1] : def; };
const GOP = flag("--gop", 10);
const CRF = flag("--crf", 21);
if (!pfx && !avatar) {
  console.error("Uso: node scripts/optimize_video_assets.mjs <prefijo> [avatar.mp4] [--gop N] [--crf N]");
  process.exit(1);
}

const LEDGER = ".optimized_assets.json";
const done = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : {};

const run = (cmd, a) =>
  new Promise((res, rej) => execFile(cmd, a, { maxBuffer: 1 << 26 }, (e, so, se) => (e ? rej(new Error(se || e.message)) : res(so))));

async function gopDe(f) {
  // cuenta keyframes en los primeros 4s: si hay >=2 ya esta razonablemente denso
  try {
    const out = await run("ffprobe", ["-v", "error", "-read_intervals", "%+4", "-select_streams", "v",
      "-show_entries", "frame=key_frame", "-of", "csv=p=0", f]);
    return out.split("\n").filter((l) => l.trim() === "1").length;
  } catch { return -1; }
}

async function optimizar(f, crf) {
  const st = fs.statSync(f);
  const key = `${f}:${st.size}`;
  if (done[key]) return "ya";
  const kf = await gopDe(f);
  if (kf >= 4) { done[key] = "ya-denso"; return "denso"; }   // 4 keyframes en 4s ~ GOP<=30
  const tmp = f + ".opt.tmp.mp4";
  await run("ffmpeg", ["-v", "error", "-y", "-i", f, "-an",
    "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
    "-c:v", "libx264", "-g", String(GOP), "-keyint_min", String(GOP), "-sc_threshold", "0",
    "-crf", String(crf), "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp]);
  const ns = fs.statSync(tmp).size;
  if (ns < 10000) { fs.unlinkSync(tmp); throw new Error("salida sospechosamente chica: " + f); }
  fs.renameSync(tmp, f);                     // atomico: el original solo se pierde con el reemplazo listo
  done[`${f}:${fs.statSync(f).size}`] = "opt";
  return `${(st.size / 1e6).toFixed(1)}→${(ns / 1e6).toFixed(1)} MB`;
}

const objetivos = [];
if (pfx) {
  for (const dir of ["public/broll"]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.startsWith(pfx) && f.endsWith(".mp4")) objetivos.push([path.join(dir, f), CRF]);
  }
}
if (avatar && fs.existsSync(avatar)) objetivos.push([avatar, 23]);   // el avatar se ve full-frame: CRF algo mayor, sigue quedando mas chico

console.log(`optimizando ${objetivos.length} videos → GOP ${GOP}, sin audio, 1920x1080`);
let ok = 0, saltados = 0, fallos = 0, antes = 0, despues = 0;
const CONC = Math.max(2, Math.min(os.cpus().length - 1, 8));
let i = 0;
async function worker() {
  while (i < objetivos.length) {
    const [f, crf] = objetivos[i++];
    const s0 = fs.statSync(f).size;
    try {
      const r = await optimizar(f, crf);
      if (r === "ya" || r === "denso") saltados++;
      else { ok++; antes += s0; despues += fs.statSync(f).size; }
    } catch (e) { fallos++; console.error("  ✗", path.basename(f), String(e).slice(0, 100)); }
    if ((ok + saltados + fallos) % 50 === 0) console.log(`  ${ok + saltados + fallos}/${objetivos.length}`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
fs.writeFileSync(LEDGER, JSON.stringify(done, null, 1));
console.log(`\n=== listo · optimizados ${ok} · ya densos ${saltados} · fallos ${fallos} ===`);
if (ok) console.log(`peso: ${(antes / 1e6).toFixed(0)} MB → ${(despues / 1e6).toFixed(0)} MB (${despues > antes ? "+" : ""}${(100 * (despues / antes - 1)).toFixed(0)}%)`);
