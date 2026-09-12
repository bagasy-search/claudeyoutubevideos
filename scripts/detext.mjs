// detext.mjs — "doctor" que LIMPIA clips con texto quemado de un video YA matcheado,
// SIN re-matchear todo. Re-scorea los public/broll/<name>.mp4 que usa el video con las
// MISMAS labels de texto que match_runner.scoreFrame y reemplaza los "texty" por video
// STOCK limpio (Pexels), mismo concepto. Después solo hay que re-renderizar.
//
//   node scripts/detext.mjs <slug> [umbral=0.16] [--dry] [--marks]
//
//   --dry    : solo lista (ordenado por nivel de texto), no baja nada → para calibrar umbral.
//   --marks  : además trata logos/marcas de agua como "sucio" (modo fauna; por defecto NO,
//              en misterio/otros las marcas se toleran).
//
// Lee:  public/broll/match_<slug>.json  (name→concept,query,dur)
//       public/broll/<name>.mp4          (el clip bajado = ventana matcheada)
// Requiere PEXELS_API_KEY en .env (igual que stockfallback.mjs).
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

// ── .env (PEXELS_API_KEY) ──
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const KEY = process.env.PEXELS_API_KEY;

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const MARKS = args.includes("--marks");
const [slug, thrArg] = args.filter((a) => !a.startsWith("--"));
if (!slug) { console.error("Uso: node scripts/detext.mjs <slug> [umbral=0.16] [--dry] [--marks]"); process.exit(1); }
const THR = +(thrArg || 0.16);
const OUT = "public/broll";
const FFDIR = path.join(process.cwd(), "node_modules", "@remotion", "compositor-win32-x64-msvc");
const FF = process.env.FFMPEG || path.join(FFDIR, "ffmpeg.exe"); // ffmpeg de Remotion (como matchall/match_runner): extrae PNG y hace zoompan/x264. SIN mjpeg → NO usar .jpg.
const TMP = "_detext_tmp";
fs.mkdirSync(TMP, { recursive: true });

const matchPath = `${OUT}/match_${slug}.json`;
if (!fs.existsSync(matchPath)) { console.error("falta:", matchPath); process.exit(1); }
const list = JSON.parse(fs.readFileSync(matchPath, "utf8"));

// ── CLIP local (idéntico a match_runner) ──
const { pipeline } = await import("@huggingface/transformers");
const CLIP_MODEL = process.env.CLIP_MODEL || "Xenova/clip-vit-base-patch32";
console.log(`cargando CLIP (${CLIP_MODEL}, q8, cpu)...`);
const clf = await pipeline("zero-shot-image-classification", CLIP_MODEL, { dtype: "q8" });
const DISTRACTORS = ["a person talking to the camera, a talking head", "a blurry or unrelated indoor scene"];
const TEXT_LABELS = ["a title card or large bold text overlay across the screen", "big subtitles or captions text on screen"];
const MARK_LABELS = ["a channel logo, watermark or banner", "a semi-transparent tv channel logo bug in the corner"];

// extrae ~1 frame/seg del clip (el archivo = ventana matcheada, ~6-8s).
// ffmpeg COMPLETO del PATH + PNG (el de Remotion no trae encoder mjpeg → daba 0 frames).
const extractFrames = (mp4, tag) => {
  const pat = path.join(TMP, `${tag}_%02d.png`);
  spawnSync(FF, ["-y", "-i", mp4, "-r", "1", "-frames:v", "8", pat], { encoding: "utf8", timeout: 60000, killSignal: "SIGKILL" });
  return fs.readdirSync(TMP).filter((f) => f.startsWith(tag + "_") && f.endsWith(".png")).map((f) => path.join(TMP, f));
};

const scoreClip = async (mp4, concept, tag) => {
  const frames = extractFrames(mp4, tag);
  if (!frames.length) return { text: 0, mark: 0 };
  const tv = [], mv = [];
  for (const fr of frames) {
    const out = await clf(fr, [concept, ...DISTRACTORS, ...TEXT_LABELS, ...MARK_LABELS]);
    const get = (l) => out.find((o) => o.label === l)?.score || 0;
    tv.push(Math.max(...TEXT_LABELS.map(get)));
    mv.push(Math.max(...MARK_LABELS.map(get)));
  }
  for (const fr of frames) fs.rmSync(fr, { force: true });
  // nivel del clip = media de los 2 frames más texty (robusto a un falso positivo suelto)
  const top2 = (a) => { const s = [...a].sort((x, y) => y - x); return s.length > 1 ? (s[0] + s[1]) / 2 : s[0] || 0; };
  return { text: top2(tv), mark: top2(mv) };
};

// ── Pexels (portado de stockfallback.mjs) ──
const STOP = new Set("a an the of to in on at by for with and or from into is are was were be this that it its as close up shot footage video clip hd 4k uhd full into dark deep".split(/\s+/));
const keywords = (s) => [...new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)))].slice(0, 3).join(" ");
const pickVideoFile = (files) => {
  const ok = files.filter((f) => f.file_type === "video/mp4").map((f) => ({ ...f, w: f.width || 0 })).sort((a, b) => a.w - b.w);
  const upTo1080 = ok.filter((f) => f.w <= 1920);
  return (upTo1080.length ? upTo1080[upTo1080.length - 1] : ok[ok.length - 1]) || null;
};
const dl = async (url, dest) => { const r = await fetch(url); if (!r.ok) throw new Error("dl " + r.status); fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer())); };
const searchVideo = async (q) => {
  const u = new URL("https://api.pexels.com/videos/search");
  u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "5"); u.searchParams.set("size", "medium");
  const r = await fetch(u, { headers: { Authorization: KEY } });
  if (!r.ok) return null;
  return ((await r.json()).videos || [])[0] || null;
};
const searchPhoto = async (q) => {
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", q); u.searchParams.set("orientation", "landscape"); u.searchParams.set("per_page", "5");
  const r = await fetch(u, { headers: { Authorization: KEY } });
  if (!r.ok) return null;
  return ((await r.json()).photos || [])[0] || null;
};
const photoToMp4 = (jpg, dest, dur) => {
  const fr = 30, frames = Math.ceil((dur + 1) * fr);
  const r = spawnSync(FF, ["-y", "-loop", "1", "-i", jpg, "-vf",
    `scale=2400:-1,zoompan=z='min(zoom+0.0008,1.15)':d=${frames}:s=1920x1080:fps=${fr}`,
    "-t", String(dur + 1), "-c:v", "libx264", "-pix_fmt", "yuv420p", dest], { encoding: "utf8" });
  return r.status === 0 && fs.existsSync(dest);
};

// ── 1) scorear clips en disco ──
const onDisk = list.filter((b) => fs.existsSync(`${OUT}/${b.name}.mp4`));
console.log(`scoreando ${onDisk.length}/${list.length} clips en disco (umbral texto=${THR}${MARKS ? " · +marcas" : ""})...`);
const scored = [];
for (let i = 0; i < onDisk.length; i++) {
  const b = onDisk[i];
  const { text, mark } = await scoreClip(`${OUT}/${b.name}.mp4`, b.concept, `c${i}`);
  const dirty = text >= THR || (MARKS && mark >= THR);
  scored.push({ ...b, text, mark, dirty });
  process.stdout.write(`\r  ${i + 1}/${onDisk.length}`);
}
console.log("");
scored.sort((a, b) => b.text - a.text);
const bad = scored.filter((s) => s.dirty);
console.log(`\nclips con texto (orden desc):`);
for (const s of scored.slice(0, 18)) console.log(`  ${s.dirty ? "✗" : " "} text=${s.text.toFixed(3)} mark=${s.mark.toFixed(3)}  ${s.name}  "${(s.concept || "").slice(0, 48)}"`);
console.log(`\n→ ${bad.length} clips sucios de ${scored.length}`);
if (DRY) { console.log("[--dry] no se reemplazó nada."); fs.rmSync(TMP, { recursive: true, force: true }); process.exit(0); }
if (!bad.length) { console.log("nada que limpiar ✓"); fs.rmSync(TMP, { recursive: true, force: true }); process.exit(0); }
if (!KEY) { console.error("\nFalta PEXELS_API_KEY en .env"); process.exit(1); }

// ── 2) reemplazar los sucios por stock limpio ──
let okV = 0, okP = 0, failed = 0;
for (const b of bad) {
  const dest = path.join(OUT, `${b.name}.mp4`);
  const queries = [b.concept, ...(Array.isArray(b.query) ? b.query : [b.query]), keywords(b.concept)].filter(Boolean);
  let done = false;
  for (const q of queries) {
    const vid = await searchVideo(q);
    if (!vid) continue;
    const vf = pickVideoFile(vid.video_files);
    if (!vf) continue;
    try { await dl(vf.link, dest); console.log(`↓ VIDEO  ${b.name}.mp4  (${q}) ${vf.width}x${vf.height}`); okV++; done = true; break; } catch {}
  }
  if (!done) for (const q of queries) {
    const ph = await searchPhoto(q);
    if (!ph) continue;
    const tmp = path.join(OUT, `_dt_${b.name}.jpg`);
    try {
      await dl(ph.src?.large2x || ph.src?.original || ph.src?.large, tmp);
      if (photoToMp4(tmp, dest, b.dur || 5)) { console.log(`↓ FOTO→mp4  ${b.name}.mp4  (${q})`); okP++; done = true; }
      fs.rmSync(tmp, { force: true });
      if (done) break;
    } catch {}
  }
  if (!done) { console.log(`✗ ${b.name}  sin stock para "${b.concept}"`); failed++; }
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`\n=== detext: ${okV} videos + ${okP} fotos limpias · ${failed} sin stock · re-renderizá el slug ===`);
