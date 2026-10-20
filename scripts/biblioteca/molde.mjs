// Desglose de un video de YouTube que el creador quiere como ESTILO (corre en el farm, con proxy:
// nunca desde la IP de la casa). Sale al release `molde-<slug>`:
//   hoja_NNN.jpg  1 cuadro cada 2 s (6x5 = 1 min por hoja) con el segundo impreso
//   gancho.jpg    los primeros 16 s a 4 cuadros/s (8x8) — el microscopio del gancho
//   ritmo.json    duración, cortes por cambio de escena, cortes/min por minuto, mediana del plano
//   escenas.txt   segundo de cada corte · info.json (título, canal, vistas) · subs.vtt si hay
// Con eso se elige qué efectos van a la Biblioteca (desde/hasta) y biblioteca.yml modo=cortes los corta.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";

const { REPO, URL, SLUG } = process.env;
if (!URL || !/^[a-z0-9_-]+$/i.test(SLUG || "")) { console.error("falta url o slug (sólo letras, números, - y _)"); process.exit(2); }
const REL = `molde-${SLUG}`, OUT = "out", T = "/tmp/molde";
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(T, { recursive: true });
const gh = (...a) => execFileSync("gh", a, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
const ff = (args, timeout = 1800000) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-y", ...args], { encoding: "utf8", timeout, killSignal: "SIGKILL", maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error((r.stderr || "").slice(-800));
  return r.stderr || "";
};
const proxies = fs.readFileSync("/tmp/proxies.txt", "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));

// 1) bajar (≤720p alcanza para leer la edición) + info + subtítulos
let ok = false;
for (let i = 0; i < Math.min(8, Math.max(1, proxies.length)) && !ok; i++) {
  const px = proxies.length ? proxies[(Math.floor(Math.random() * proxies.length) + i) % proxies.length] : "";
  const r = spawnSync("yt-dlp", [...(px ? ["--proxy", px] : []), "--no-playlist", "--no-warnings",
    "-f", "bv*[height<=720][vcodec^=avc1]+ba/bv*[height<=720]+ba/b[height<=720]/b", "--merge-output-format", "mp4",
    "--write-info-json", "--write-auto-subs", "--write-subs", "--sub-langs", "en.*,es.*", "--sub-format", "vtt",
    "-o", `${T}/v.%(ext)s`, URL], { encoding: "utf8", timeout: 1800000, killSignal: "SIGKILL" });
  ok = r.status === 0 && fs.existsSync(`${T}/v.mp4`);
  if (!ok) console.log(`intento ${i + 1}: ${(r.stderr || "").trim().split("\n").slice(-2).join(" | ")}`);
}
if (!ok) { console.error("no pude bajar el video"); process.exit(1); }
const info = JSON.parse(fs.readFileSync(`${T}/v.info.json`, "utf8"));
fs.writeFileSync(`${OUT}/info.json`, JSON.stringify({
  url: URL, id: info.id, titulo: info.title, canal: info.channel || info.uploader, canal_url: info.channel_url,
  vistas: info.view_count, likes: info.like_count, subida: info.upload_date, duracion: info.duration,
  ancho: info.width, alto: info.height, fps: info.fps,
}, null, 1));
const vtt = fs.readdirSync(T).find((f) => f.endsWith(".vtt"));
if (vtt) fs.copyFileSync(`${T}/${vtt}`, `${OUT}/subs.vtt`);
const V = `${T}/v.mp4`, D = info.duration || 0;

// 2) cortes por cambio de escena → ritmo
const log = ff(["-i", V, "-an", "-vf", "scale=320:-2,select='gt(scene,0.28)',showinfo", "-f", "null", "-"]);
const cuts = [...log.matchAll(/pts_time:([\d.]+)/g)].map((m) => +(+m[1]).toFixed(2));
fs.writeFileSync(`${OUT}/escenas.txt`, cuts.join("\n"));
const planos = [0, ...cuts, D].slice(1).map((b, i, arr) => +(b - [0, ...cuts][i]).toFixed(2)).filter((x) => x > 0);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const porMin = Array.from({ length: Math.ceil(D / 60) }, (_, m) => cuts.filter((c) => c >= m * 60 && c < (m + 1) * 60).length);
fs.writeFileSync(`${OUT}/ritmo.json`, JSON.stringify({
  duracion: D, cortes: cuts.length, cortes_min: +(cuts.length / (D / 60)).toFixed(1),
  mediana_plano: med(planos), mediana_plano_gancho: med(planos.filter((_, i) => [0, ...cuts][i] < 60)),
  cortes_por_minuto: porMin, plano_mas_largo: Math.max(0, ...planos),
}, null, 1));

// 3) hojas de contacto con el segundo impreso
const FONT = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"].find((f) => fs.existsSync(f));
const sello = FONT ? `,drawtext=fontfile=${FONT}:text='%{pts\\:hms}':x=6:y=h-th-6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=4` : "";
ff(["-i", V, "-an", "-vf", `fps=1/2,scale=320:180${sello},tile=6x5:padding=4:color=black`, "-q:v", "3", `${OUT}/hoja_%03d.jpg`]);
ff(["-t", "16", "-i", V, "-an", "-vf", `fps=4,scale=240:135${sello.replace("fontsize=20", "fontsize=15")},tile=8x8:padding=3:color=black`, "-frames:v", "1", "-q:v", "3", `${OUT}/gancho.jpg`]);

// 4) al release
try { gh("release", "view", REL, "-R", REPO); } catch { gh("release", "create", REL, "-R", REPO, "-t", REL, "-n", `molde para la Biblioteca: ${URL}`); }
const files = fs.readdirSync(OUT).map((f) => `${OUT}/${f}`);
for (let i = 0; i < files.length; i += 40) gh("release", "upload", REL, "-R", REPO, "--clobber", ...files.slice(i, i + 40));
console.log(`listo: ${REL} · ${cuts.length} cortes · ${(cuts.length / (D / 60)).toFixed(1)}/min · ${files.length} archivos`);
