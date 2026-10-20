// Corta las muestras en loop de la Biblioteca de estilos (corre en el farm, workflow biblioteca.yml).
// Entrada: cortes.json del release `biblioteca` (lo sube D:/claude-brain/biblioteca/publicar.mjs):
//   { efectos: [{ id, src: { tipo: "release", release, archivo } | { tipo: "youtube", url }, desde, hasta }],
//     estilos: [{ id, clips: [idEfecto, ...] }] }
// Salida (al mismo release): <id>.mp4 (854x480, 30 fps, sin audio, faststart) + <id>.jpg (póster)
// y estilo-<id>.mp4/.jpg (reel: ~2,2 s de cada efecto del estilo). El release es sólo el paso
// intermedio: publicar.mjs lo pasa al bucket `biblioteca` de Supabase, que es lo que lee Bagasy.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import { bajarAlt } from "./ytalt.mjs";

const REPO = process.env.REPO, REL = "biblioteca";
const IDS = (process.env.IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
const TODO = process.env.TODO === "1";
const OUT = "out", TMP = "/tmp/bib";
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });

const gh = (...a) => execFileSync("gh", a, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
const ff = (args, timeout = 240000) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8", timeout, killSignal: "SIGKILL" });
  if (r.status !== 0) throw new Error((r.stderr || "").slice(-600) || `ffmpeg salió ${r.status}`);
};
const dura = (f) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", f], { encoding: "utf8" });
  const m = (r.stderr || "").match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
};

gh("release", "download", REL, "-R", REPO, "-p", "cortes.json", "-D", TMP, "--clobber");
const C = JSON.parse(fs.readFileSync(`${TMP}/cortes.json`, "utf8"));
const ya = new Set(JSON.parse(gh("release", "view", REL, "-R", REPO, "--json", "assets")).assets.map((a) => a.name));
const proxies = (fs.existsSync("/tmp/proxies.txt") ? fs.readFileSync("/tmp/proxies.txt", "utf8") : "")
  .split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));

// mismo look para todo: 16:9 lleno, 30 fps, GOP corto (arranca al instante al pasar el mouse)
const VF = "scale=854:480:force_original_aspect_ratio=increase,crop=854:480,fps=30,format=yuv420p";
// recorte = {x,y,w,h} en fracciones del cuadro (ej. sólo los gráficos de arriba de un reel vertical);
// encaje "pad" = entra entero con bordes del color del fondo en vez de llenar recortando (fuentes verticales)
const vfDe = (e) => {
  const r = e.recorte, pre = r ? `crop=iw*${r.w}:ih*${r.h}:iw*${r.x}:ih*${r.y},` : "";
  if (e.encaje !== "pad") return pre + VF;
  return `${pre}scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2:color=${e.fondo || "0x08080a"},fps=30,format=yuv420p`;
};
const ENC = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-g", "30", "-movflags", "+faststart"];
const poster = (mp4, jpg, at) => ff(["-ss", String(at), "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg]);

// YouTube: sólo el tramo, sólo video, con keyframe en el corte (el segundo exacto), rotando proxies.
// 20-oct: YouTube bloquea las IPs de GitHub → proxies antes que cookies; si nada anda, plan B (ytalt.mjs)
// baja el video ENTERO una sola vez por link y los tramos se cortan de ahí.
const enteros = new Map();
const bajarYT = async (url, a, b, dst) => {
  const COOKIES = fs.existsSync("/tmp/cookies") ? fs.readdirSync("/tmp/cookies").map((f) => `/tmp/cookies/${f}`) : [];
  const intentos = [["", []], ...proxies.slice(0, 4).map((p) => [p, []]), ...COOKIES.map((c) => ["", ["--cookies", c]])];
  const probar = (i) => {
    const [px, extra] = intentos[i];
    const r = spawnSync("yt-dlp", [...(px ? ["--proxy", px] : []), ...extra, "--socket-timeout", "20", "--no-playlist", "--quiet", "--no-warnings",
      "-f", "bv*[height<=1080][vcodec^=avc1]/bv*[height<=1080]/b[height<=1080]/b",
      "--download-sections", `*${a}-${b}`, "--force-keyframes-at-cuts",
      "--remux-video", "mp4", "-o", dst, url], { encoding: "utf8", timeout: 300000, killSignal: "SIGKILL" });
    if (r.status === 0 && fs.existsSync(dst) && fs.statSync(dst).size > 20000) return true;
    console.log(`  yt-dlp intento ${i + 1} falló: ${(r.stderr || "").trim().split("\n").pop()}`);
    return false;
  };
  if (!enteros.has(url)) for (let i = 0; i < intentos.length; i++) if (probar(i)) return;
  if (!enteros.has(url)) { // último recurso (ver molde.mjs): túneles públicos, el video entero una sola vez por link
    const f = `${TMP}/alt/entero_${enteros.size}.mp4`;
    fs.mkdirSync(`${TMP}/alt`, { recursive: true });
    const r = await bajarAlt(url, f, { alto: 720, audio: false });
    console.log(r.ok ? `  plan B: ${r.via} (${r.alto}p)` : "  plan B: ningún túnel anduvo");
    enteros.set(url, r.ok ? f : null);
  }
  const f = enteros.get(url);
  if (f) { ff(["-ss", String(a), "-i", f, "-t", String(b - a), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", dst]); return; }
  throw new Error("no pude bajar el tramo de YouTube");
};

const hechos = [], fallas = [];
const pend = C.efectos.filter((e) => (IDS.length ? IDS.includes(e.id) : TODO || !ya.has(`${e.id}.mp4`)));
console.log(`efectos a cortar: ${pend.length} de ${C.efectos.length}`);
for (const e of pend) {
  const dur = Math.min(8, Math.max(1.5, e.hasta - e.desde));
  const mp4 = `${OUT}/${e.id}.mp4`;
  try {
    if (e.src.tipo === "youtube") {
      const raw = `${TMP}/yt_${e.id}.mp4`;
      await bajarYT(e.src.url, e.desde, e.hasta, raw);
      ff(["-i", raw, "-t", String(dur), "-vf", vfDe(e), ...ENC, mp4]);
    } else {
      const url = `https://github.com/${REPO}/releases/download/${e.src.release}/${e.src.archivo}`;
      ff(["-reconnect", "1", "-reconnect_on_network_error", "1", "-reconnect_delay_max", "5",
        "-ss", String(e.desde), "-i", url, "-t", String(dur), "-vf", vfDe(e), ...ENC, mp4]);
    }
    const d = dura(mp4);
    if (d < 1) throw new Error("salió vacío");
    poster(mp4, `${OUT}/${e.id}.jpg`, (e.poster ?? 0.45) * d);
    hechos.push(e.id);
    console.log(`✓ ${e.id} (${d.toFixed(1)} s, ${(fs.statSync(mp4).size / 1024).toFixed(0)} KB)`);
  } catch (err) {
    fallas.push({ id: e.id, error: String(err.message || err).slice(0, 300) });
    console.log(`✗ ${e.id}: ${err.message}`);
    fs.rmSync(mp4, { force: true });
  }
}

// reels de estilo: se rehacen si cambió alguno de sus clips o si falta el reel
for (const s of C.estilos || []) {
  const clips = (s.clips || []).filter((id) => C.efectos.some((e) => e.id === id));
  const toca = TODO || !ya.has(`estilo-${s.id}.mp4`) || clips.some((id) => hechos.includes(id)) || IDS.includes(`estilo-${s.id}`);
  if (!toca || !clips.length) continue;
  // corridas en paralelo (una por estilo): el reel lo arma sólo la que tiene TODOS sus clips, si no queda a medias
  const faltan = clips.filter((id) => !hechos.includes(id) && !ya.has(`${id}.mp4`));
  if (faltan.length) { console.log(`reel ${s.id}: espera ${faltan.join(", ")}`); continue; }
  try {
    const partes = [];
    for (const id of clips) {
      let src = `${OUT}/${id}.mp4`;
      if (!fs.existsSync(src)) {
        if (!ya.has(`${id}.mp4`)) continue;
        gh("release", "download", REL, "-R", REPO, "-p", `${id}.mp4`, "-D", TMP, "--clobber");
        src = `${TMP}/${id}.mp4`;
      }
      const d = dura(src), seg = Math.min(2.4, d), from = Math.max(0, Math.min(d - seg, d * 0.3));
      const p = `${TMP}/r_${s.id}_${partes.length}.mp4`;
      ff(["-ss", String(from), "-i", src, "-t", String(seg), "-vf", "fps=30,format=yuv420p", ...ENC, p]);
      partes.push(p);
    }
    if (!partes.length) continue;
    fs.writeFileSync(`${TMP}/l_${s.id}.txt`, partes.map((p) => `file '${p}'`).join("\n"));
    const mp4 = `${OUT}/estilo-${s.id}.mp4`;
    ff(["-f", "concat", "-safe", "0", "-i", `${TMP}/l_${s.id}.txt`, "-vf", "fps=30,format=yuv420p", ...ENC, mp4]);
    poster(mp4, `${OUT}/estilo-${s.id}.jpg`, 0.6);
    hechos.push(`estilo-${s.id}`);
    console.log(`✓ reel estilo-${s.id} (${partes.length} clips, ${dura(mp4).toFixed(1)} s)`);
  } catch (err) {
    fallas.push({ id: `estilo-${s.id}`, error: String(err.message || err).slice(0, 300) });
    console.log(`✗ reel ${s.id}: ${err.message}`);
  }
}

fs.writeFileSync(`${OUT}/ultimo_run.json`, JSON.stringify({ fecha: new Date().toISOString(), hechos, fallas }, null, 1));
const files = fs.readdirSync(OUT).map((f) => `${OUT}/${f}`);
for (let i = 0; i < files.length; i += 40) gh("release", "upload", REL, "-R", REPO, "--clobber", ...files.slice(i, i + 40));
console.log(`listo: ${hechos.length} hechos, ${fallas.length} fallas`);
if (fallas.length) console.log(JSON.stringify(fallas, null, 1));
if (pend.length && !hechos.length) process.exit(1);
