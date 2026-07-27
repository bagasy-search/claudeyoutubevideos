// prep_assets_vucm3bvd4u3k.mjs — VALIDA y COMPRIME la biblioteca antes del build.
//
// 1) Cada clip pasa por ffprobe: sin stream de video, corrupto, vertical o más corto
//    que su beat → SE DESCARTA (un mp4 roto mata el chunk entero del render).
// 2) Los que quedan se recortan al largo que usa el build (+1,5 s de cola anti-congelado)
//    y bajan a 720p CRF 26 sin audio: el tarball del farm tiene tope de 2 GB.
// 3) Los PNG de gpt-image pasan a JPG q4. ⚠ Esto CAMBIA la extensión, así que el
//    generador de cues se corre DESPUÉS (si no, quedan rutas .png que dan 404).
//
//   node scripts/prep_assets_vucm3bvd4u3k.mjs [conc=4]
import fs from "fs";
import path from "path";
import { spawnSync, spawn } from "child_process";

const SLUG = "vucm3bvd4u3k";
const DIR = `public/broll/${SLUG}`;
const IMG = "public/img";
const CONC = +(process.argv[2] || 4);

const plan = JSON.parse(fs.readFileSync(`_v3/plan_${SLUG}.json`, "utf8"));
const durDe = new Map(plan.map((p) => [p.name, p.dur]));

const probe = (f) => {
  // ⚠ UN SOLO -show_entries, con los dos grupos separados por ":".
  // Pasar DOS flags -show_entries hace que el segundo ANULE al primero: la salida
  // traía sólo la duración, el ancho leía NaN y TODO archivo sano se reportaba
  // como "corrupto". Ese bug ya borró 72 clips buenos una vez — de ahí que ahora
  // los rechazados se aparten en _rechazados/ en lugar de eliminarse.
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", f], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const L = r.stdout.trim().split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const w = +L[0], h = +L[1], dur = parseFloat(L[2]);
  if (!w || !h || !Number.isFinite(dur)) return null;
  return { w, h, dur };
};

/* ── 1) validación ──────────────────────────────────────────────────────────── */
const clips = fs.readdirSync(DIR).filter((f) => /\.mp4$/i.test(f) && !/_720\.mp4$/i.test(f));
const REJ = path.join(DIR, "_rechazados");
const buenos = [];
let malos = 0;
const apartar = (p, f) => { fs.mkdirSync(REJ, {recursive: true}); try { fs.renameSync(p, path.join(REJ, f)); } catch {} };
for (const f of clips) {
  const p = path.join(DIR, f);
  const beat = f.replace(/\.mp4$/i, "");
  const info = probe(p);
  const need = Math.min(4, (durDe.get(beat) || 4));
  if (!info) { console.log(`  ✗ ${f} corrupto/ilegible`); apartar(p, f); malos++; continue; }
  if (info.h > info.w) { console.log(`  ✗ ${f} VERTICAL ${info.w}x${info.h}`); apartar(p, f); malos++; continue; }
  if (info.dur < Math.max(1.5, need * 0.6)) { console.log(`  ✗ ${f} demasiado corto (${info.dur.toFixed(1)}s < beat ${need.toFixed(1)}s)`); apartar(p, f); malos++; continue; }
  buenos.push({ f, beat, ...info });
}
console.log(`validación: ${buenos.length} clips OK · ${malos} descartados`);

/* ── 2) recorte + 720p ──────────────────────────────────────────────────────── */
async function run(cmd, args) {
  return new Promise((res) => {
    const c = spawn(cmd, args, { stdio: ["ignore", "ignore", "ignore"] });
    c.on("close", (code) => res(code === 0));
  });
}
let i = 0, comp = 0, err = 0;
async function worker() {
  while (true) {
    const it = buenos[i++];
    if (!it) return;
    const src = path.join(DIR, it.f);
    const tmp = path.join(DIR, `_t_${it.beat}.mp4`);
    const t = Math.min(it.dur, (durDe.get(it.beat) || 4) + 1.5);
    const ok = await run("ffmpeg", ["-y", "-v", "error", "-i", src, "-t", String(t.toFixed(2)),
      "-an", "-vf", "scale=-2:720:flags=fast_bilinear", "-c:v", "libx264", "-preset", "veryfast",
      "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", tmp]);
    if (ok && fs.existsSync(tmp) && fs.statSync(tmp).size > 20000) {
      fs.rmSync(src); fs.renameSync(tmp, src); comp++;
    } else { try { fs.rmSync(tmp); } catch {} err++; }
    if ((comp + err) % 15 === 0) console.log(`  … ${comp + err}/${buenos.length} recomprimidos`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log(`recompresión: ${comp} ok · ${err} fallaron (se quedan en su versión original)`);

/* ── 3) PNG → JPG ───────────────────────────────────────────────────────────── */
const pngs = fs.readdirSync(IMG).filter((f) => /\.png$/i.test(f) && f.startsWith(SLUG));
let j = 0, jok = 0, jerr = 0;
async function jworker() {
  while (true) {
    const f = pngs[j++];
    if (!f) return;
    const src = path.join(IMG, f);
    const dst = src.replace(/\.png$/i, ".jpg");
    if (fs.existsSync(dst)) { fs.rmSync(src); jok++; continue; }
    const ok = await run("ffmpeg", ["-y", "-v", "error", "-i", src, "-q:v", "4", dst]);
    if (ok && fs.existsSync(dst) && fs.statSync(dst).size > 8000) { fs.rmSync(src); jok++; }
    else { try { fs.rmSync(dst); } catch {} jerr++; }
    if ((jok + jerr) % 40 === 0) console.log(`  … ${jok + jerr}/${pngs.length} imágenes a JPG`);
  }
}
await Promise.all(Array.from({ length: CONC }, jworker));
console.log(`imágenes: ${jok} a JPG · ${jerr} quedaron en PNG`);

const du = (d) => {
  let t = 0;
  for (const f of fs.readdirSync(d)) { try { t += fs.statSync(path.join(d, f)).size; } catch {} }
  return (t / 1e6).toFixed(0) + " MB";
};
console.log(`\n=== biblioteca: b-roll ${fs.readdirSync(DIR).filter((f) => /\.mp4$/i.test(f)).length} clips (${du(DIR)}) · imágenes ${fs.readdirSync(IMG).filter((f) => f.startsWith(SLUG)).length} (${du(IMG)}) ===`);
