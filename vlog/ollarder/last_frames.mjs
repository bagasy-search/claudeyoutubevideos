// Último cuadro de cada clip (agnes v2.0 y stock) → <clip>_last.jpg, para que un plano más largo que su clip termine en el último cuadro quieto (nunca en loop).
import fs from "node:fs"; import { execFileSync } from "node:child_process";
let n = 0;
for (const d of ["public/broll/ollarder"]) for (const f of fs.readdirSync(d).filter((f) => f.endsWith(".mp4"))) {
  const out = `${d}/${f.replace(/\.mp4$/, "_last.jpg")}`;
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(`${d}/${f}`).mtimeMs) continue;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-sseof", "-0.12", "-i", `${d}/${f}`, "-frames:v", "1", "-q:v", "3", out], { windowsHide: true }); n++;
}
console.log("últimos cuadros:", n);
