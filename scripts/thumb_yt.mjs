// thumb_yt.mjs — prepara la miniatura para YouTube: SIEMPRE 1280x720 JPEG (lanczos + nitidez suave).
// 15-oct-2026: con la de gpt-image (1088x608) YouTube NO genera maxres (máximo 640x480 con franjas) y en
// pantallas grandes se ve borrosa; a 1280x720 sí genera maxresdefault y queda nítida (A/B en ctrcemento).
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
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", a, "-vf",
      "scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,unsharp=5:5:0.6:5:5:0.0", "-q:v", "2", b]);
    let buf = fs.readFileSync(b);
    if (buf.length > 1900000) {  // tope de YouTube 2 MB
      execFileSync("ffmpeg", ["-v", "error", "-y", "-i", b, "-q:v", "4", b + ".jpg"]); buf = fs.readFileSync(b + ".jpg"); fs.rmSync(b + ".jpg", { force: true });
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
