// Corta del máster los tramos de los clips hablados (ventana = de la 1ª toma vl a la última, desde _v3/olsup_shots.json)
// y actualiza texto/audio en el plan de agnes: node vlog/olsup/tramos_auto.mjs <plan.json>
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const R = "D:/Proyectos/video2-wt/olsup/";
const planF = process.argv[2] || R + "vlog/olsup/M1/plan.json";
const { vl } = JSON.parse(fs.readFileSync(R + "_v3/olsup_shots.json", "utf8"));
const W = JSON.parse(fs.readFileSync(R + "_v3/olsup_wordms.json", "utf8"));
const P = JSON.parse(fs.readFileSync(planF, "utf8"));
fs.mkdirSync(R + "vlog/olsup/tramos", { recursive: true });
for (const c of P.clips) {
  const v = vl[c.id]; if (!v) continue;
  const s = Math.max(0, v.s - 0.03), e = v.e + 0.06;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", s.toFixed(3), "-to", e.toFixed(3), "-i", R + "public/olsup.wav", "-ac", "1", "-ar", "44100", R + `vlog/olsup/tramos/${c.id}.wav`], { windowsHide: true });
  const ws = W.filter((w) => w.s >= v.s - 0.05 && w.e <= v.e + 0.15).map((w) => w.w);
  c.audio = R + `vlog/olsup/tramos/${c.id}.wav`; c.text = ws.join(" ");
  console.log(c.id, (e - s).toFixed(2), "s |", c.text.slice(0, 90));
}
fs.writeFileSync(planF, JSON.stringify(P, null, 1));
