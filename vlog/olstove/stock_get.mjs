// Baja el stock elegido (sel.json: st_<clave>_<n> → id Pexels) → public/broll/olstove_st30/<name>.mp4 (1920x1080, 30/1 CFR, sin audio, recortado a dur+1 s). Créditos Pexels.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olstove/", SRC = "D:/rtmp/olstove_src/pex/";
const pool = JSON.parse(fs.readFileSync(SRC + "pool.json", "utf8")), sel = JSON.parse(fs.readFileSync(SRC + "sel.json", "utf8"));
const { shots } = JSON.parse(fs.readFileSync(R + "_v3/olstove_shots.json", "utf8"));
fs.mkdirSync(SRC + "raw", { recursive: true }); fs.mkdirSync(R + "public/broll/olstove_st30", { recursive: true });
const cred = [];
for (const s of shots.filter((s) => s.kind === "st")) {
  const v = pool[sel[s.name]]; if (!v) { console.log("⛔ sin selección", s.name); continue; }
  const out = R + `public/broll/olstove_st30/${s.name}.mp4`;
  cred.push(`${s.name}.mp4 | pexels ${v.id} | ${v.user} | ${v.page} | "${v.q}"`);
  if (fs.existsSync(out)) continue;
  const raw = SRC + `raw/${v.id}.mp4`;
  if (!fs.existsSync(raw)) fs.writeFileSync(raw, Buffer.from(await (await fetch(v.url)).arrayBuffer()));
  const t = Math.min(v.dur - 0.7, s.dur + 1.2);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "0.4", "-i", raw, "-t", t.toFixed(2), "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", out], { windowsHide: true });
  console.log(s.name, v.q, t.toFixed(1));
}
fs.writeFileSync(R + "vlog/olstove/CREDITOS_stock.txt", cred.join("\n") + "\n");
