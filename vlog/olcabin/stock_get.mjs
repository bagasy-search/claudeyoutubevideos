// Baja el stock elegido en el DIRECTOR (kind st, name st<idx del pool aprobado>) → public/broll/olcabin_st30/<name>.mp4
// 1920x1080, 30/1 CFR, sin audio, recortado a (dur del plano + 1 s) desde 0,6 s. Anota créditos Pexels.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olcabin/", SRC = "D:/rtmp/olcabin_src/pex/";
const pool = JSON.parse(fs.readFileSync(SRC + "pool.json", "utf8")), ids = JSON.parse(fs.readFileSync(SRC + "ok_ids.json", "utf8"));
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olcabin_shots.json", "utf8"));
const cred = [];
for (const s of shots.filter((s) => s.kind === "st")) {
  const v = pool[String(ids[+s.name.slice(2)])]; const out = R + `public/broll/olcabin_st30/${s.name}.mp4`;
  cred.push(`${s.name}.mp4 | pexels ${v.id} | ${v.user} | ${v.page} | "${v.q}"`);
  if (fs.existsSync(out)) continue;
  const raw = SRC + `raw/${v.id}.mp4`;
  if (!fs.existsSync(raw)) fs.writeFileSync(raw, Buffer.from(await (await fetch(v.url)).arrayBuffer()));
  const t = Math.min(v.dur - 0.7, s.dur + 1.2);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "0.6", "-i", raw, "-t", t.toFixed(2), "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "22", "-preset", "veryfast", "-g", "30", out], { windowsHide: true });
  console.log(s.name, v.q, t.toFixed(1));
}
fs.writeFileSync(R + "vlog/olcabin/CREDITOS_stock.txt", cred.join("\n") + "\n");
