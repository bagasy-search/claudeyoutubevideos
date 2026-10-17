// thumb_yt.mjs — prepara la miniatura para YouTube: 16:9, MÍNIMO 1280x720, y NUNCA la achica.
// 15-oct-2026: con la de gpt-image (1088x608) YouTube NO genera maxres (máximo 640x480 con franjas) y en
// pantallas grandes se ve borrosa; a 1280x720 sí genera maxresdefault y queda nítida (A/B en ctrcemento).
// 17-oct-2026: las de ChatGPT web vienen en 1672x941 y se achicaban a 1280: ahora quedan en su resolución
// (tope 3840 de ancho), JPEG 4:4:4 a máxima calidad, bajando la calidad sólo si pasa los 2 MB de la API.
//   import { thumbYT } from "./thumb_yt.mjs";  const { buf, ct } = await thumbYT(url | Buffer);
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

export async function thumbYT(src) {
  const raw = Buffer.isBuffer(src) ? src : Buffer.from(await (await fetch(src)).arrayBuffer());
  const id = Math.random().toString(36).slice(2, 8);
  const a = path.join(os.tmpdir(), `thyt_${id}_in`), b = path.join(os.tmpdir(), `thyt_${id}.jpg`);
  try {
    fs.writeFileSync(a, raw);
    const iw = Number(String(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width", "-of", "csv=p=0", a])).trim()) || 1280;
    const W = Math.min(3840, Math.max(1280, iw)) & ~15, H = Math.round(W * 9 / 16) & ~1;
    const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}` + (iw < 1280 ? ",unsharp=5:5:0.6:5:5:0.0" : "");
    let buf;
    for (const q of [1, 2, 3, 4, 6]) {  // tope de YouTube 2 MB
      execFileSync("ffmpeg", ["-v", "error", "-y", "-i", a, "-vf", vf, "-pix_fmt", "yuvj444p", "-q:v", String(q), b]);
      buf = fs.readFileSync(b);
      if (buf.length <= 1900000) break;
    }
    return { buf, ct: "image/jpeg" };
  } catch (e) {
    console.log("  thumb_yt: no pude convertir, uso la original:", String(e.message).slice(0, 120));
    return { buf: raw, ct: "image/png" };
  } finally { fs.rmSync(a, { force: true }); fs.rmSync(b, { force: true }); }
}

// YouTube rechaza "<" ">" en la descripción ("invalid video description") y corta en 5000 BYTES, no caracteres (15-oct, rdkudzu)
export function descYT(d) {
  let s = (d || "").replace(/</g, "‹").replace(/>/g, "›");
  while (Buffer.byteLength(s, "utf8") > 4950) s = s.slice(0, -20);
  return s;
}
