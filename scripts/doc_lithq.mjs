// doc_lithq.mjs — (farm) baja en HQ las tomas elegidas por doc_litplan y deja SOLO el tramo sin cortes de escena.
// Uso: node scripts/doc_lithq.mjs <pedidos.json> <lista_videos.json> <idx> <total> <salida>
//   pedidos = [{key, vid, t, need}] (plan.hq) · lista = [{k, id, url}] (la de litidx)
//   → <salida>/<key>.mp4 (≤1080p, h264 crf 18, con audio)  + <salida>/hq_<idx>.json {key: {dur, t_in, w, h}}
//   t_in = dónde cae, dentro del recorte, el cuadro que eligió CLIP.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const [PED, LIST, I, N, O] = process.argv.slice(2);
const urls = Object.fromEntries(JSON.parse(fs.readFileSync(LIST, "utf8")).map((v) => [v.id, v.url]));
const mios = JSON.parse(fs.readFileSync(PED, "utf8")).filter((_, i) => i % +N === +I);
const ANTES = 10, DESP = 16, UMBRAL = +(process.env.HQ_SCENE || 0.28);
fs.mkdirSync(O, { recursive: true });
const run = (cmd, args, ms = 600e3) => spawnSync(cmd, args, { encoding: "utf8", timeout: ms, maxBuffer: 64e6 });
const res = {};
for (const q of mios) {
  const a = Math.max(0, q.t - ANTES), crudo = path.join(O, `_${q.key}.mp4`), fin = path.join(O, `${q.key}.mp4`);
  run("yt-dlp", [urls[q.vid], "-f", "bv*[height<=1080][vcodec^=avc1]+ba/b[height<=1080]/bv*[height<=1080]+ba/b", "-N", "6", "--no-playlist", "--quiet", "--no-warnings",
    "--socket-timeout", "20", "--retries", "3", "--force-keyframes-at-cuts", "--download-sections", `*${a}-${q.t + DESP}`, "--remux-video", "mp4", "-o", crudo]);
  if (!fs.existsSync(crudo)) { console.log("X bajar", q.key); continue; }
  // cortes de escena → ventana [c0, c1] que contiene el cuadro elegido
  const sc = run("ffmpeg", ["-hide_banner", "-i", crudo, "-vf", `scale=320:-2,select='gt(scene,${UMBRAL})',showinfo`, "-an", "-f", "null", "-"]);
  const cortes = [...(sc.stderr || "").matchAll(/pts_time:([\d.]+)/g)].map((m) => +m[1]);
  const pr = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", crudo]);
  const J = JSON.parse(pr.stdout || "{}"), dur = +(J.format?.duration || 0), st = J.streams?.[0] || {};
  const tc = q.t - a;   // posición del cuadro elegido en el crudo
  const c0 = Math.max(0, ...cortes.filter((c) => c <= tc + 0.2)) + (cortes.some((c) => c <= tc + 0.2) ? 0.12 : 0);
  const c1 = Math.min(dur, ...cortes.filter((c) => c > tc + 0.2)) - 0.12;
  if (c1 - c0 < 1.5) { console.log("X corto", q.key, (c1 - c0).toFixed(1)); fs.rmSync(crudo); continue; }
  run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-ss", c0.toFixed(3), "-to", c1.toFixed(3), "-i", crudo, "-vf", "scale='min(1920,iw)':-2", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart", fin]);
  fs.rmSync(crudo);
  if (!fs.existsSync(fin)) { console.log("X cod", q.key); continue; }
  res[q.key] = { dur: +(c1 - c0).toFixed(2), t_in: +(tc - c0).toFixed(2), w: st.width, h: st.height };
  console.log("ok", q.key, `${st.width}x${st.height}`, (c1 - c0).toFixed(1) + "s");
}
fs.writeFileSync(path.join(O, `hq_${I}.json`), JSON.stringify(res, null, 1));
