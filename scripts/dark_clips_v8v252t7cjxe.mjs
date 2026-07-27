// dark_clips_v8v252t7cjxe.mjs — caza los clips de b-roll DEMASIADO OSCUROS.
// La cuadrícula del auditor mostró un frame prácticamente negro: era un clip de Pexels de una query
// deliberadamente nocturna ("dark hallway", "bedroom lamp switched off"). No llega a disparar el
// blackdetect del farm (no es negro puro) pero en pantalla se lee como un bache.
// Mide el brillo medio de un frame del medio de cada clip y lista los que están por debajo del umbral.
//   node scripts/dark_clips_v8v252t7cjxe.mjs [umbral=32]
import fs from "fs";
import { spawnSync } from "child_process";

const SLUG = "v8v252t7cjxe";
const UMBRAL = +(process.argv[2] || 32);

const ts = fs.readFileSync(`src/_fed6/VideoEdit/federer_${SLUG}_broll.ts`, "utf8");
const clips = [...ts.matchAll(/"name":"([^"]+)","src":"broll\/([^"]+)\.mp4"/g)].map((m) => m[2]);
console.log(`midiendo brillo de ${clips.length} clips (umbral ${UMBRAL}/255) ...`);

const oscuros = [];
for (const name of clips) {
  const f = `public/broll/${name}.mp4`;
  if (!fs.existsSync(f)) continue;
  // signalstats sobre 3 frames repartidos → YAVG (luma media). OJO: `metadata=print` escribe en
  // STDERR, no en stdout — leyendo stdout el script daba "0 clips oscuros" siempre.
  const ys = [];
  for (const ss of ["0.3", "1.2", "2.4"]) {
    const r = spawnSync("ffmpeg", ["-v", "info", "-ss", ss, "-i", f, "-frames:v", "1",
      "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"],
      { encoding: "utf8" });
    const m = /YAVG=([\d.]+)/.exec(String(r.stderr || ""));
    if (m) ys.push(+m[1]);
  }
  if (!ys.length) continue;
  const y = ys.reduce((a, b) => a + b, 0) / ys.length;
  if (y < UMBRAL) oscuros.push({ name, y });
}
oscuros.sort((a, b) => a.y - b.y);
console.log(`\nclips oscuros: ${oscuros.length}`);
for (const o of oscuros) console.log(`  ${o.name}  luma ${o.y.toFixed(1)}`);
fs.writeFileSync(`_dark_${SLUG}.json`, JSON.stringify(oscuros.map((o) => o.name), null, 1));
