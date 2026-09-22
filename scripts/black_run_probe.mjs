// scripts/black_run_probe.mjs — mide CUÁNTOS FRAMES seguidos queda negro el arranque de un beat.
// `blackdetect d=0.2` necesita ~6 cuadros seguidos: un solo frame negro no lo dispara, pero 8 sí.
//   node scripts/black_run_probe.mjs <slug> <f0,f0,f0...> [--len 12]
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
process.env.TEMP = "D:/rtmp/tmp"; process.env.TMP = "D:/rtmp/tmp"; process.env.TMPDIR = "D:/rtmp/tmp";
const FFMPEG = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";

// Luma media exacta: reducir a 1x1 en gris y leer el byte. `signalstats` NO sirve acá —
// sus métricas van por metadata, no al log, así que "no imprime nada" se confunde con "0".
export const luma = (png) => {
  const out = execFileSync(FFMPEG, ["-v", "error", "-i", png, "-vf", "format=gray,scale=1:1", "-f", "rawvideo", "-"],
    { encoding: "buffer", stdio: ["ignore", "pipe", "pipe"] });
  return out.length ? out[0] : NaN;
};

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  const slug = process.argv[2];
  const f0s = (process.argv[3] || "").split(",").filter(Boolean).map(Number);
  const i = process.argv.indexOf("--len"); const LEN = i > 0 ? +process.argv[i + 1] : 12;
  if (!slug || !f0s.length) { console.error("uso: node scripts/black_run_probe.mjs <slug> <f0,f0,...> [--len 12]"); process.exit(1); }
  const OUT = `D:/rtmp/${slug}_blackrun`; fs.mkdirSync(OUT, { recursive: true });
  const serveUrl = await bundle({ entryPoint: path.resolve(`src/index_${slug}.tsx`), onProgress: () => {} });
  const composition = await selectComposition({ serveUrl, id: slug.charAt(0).toUpperCase() + slug.slice(1) });
  for (const f0 of f0s) {
    const vals = [];
    for (let k = 0; k < LEN; k++) {
      const png = path.join(OUT, `f${f0}_${k}.png`);
      await renderStill({ serveUrl, composition, frame: f0 + k, output: png, overwrite: true, scale: 0.35 });
      vals.push(luma(png));
    }
    // cuadros seguidos desde el arranque por debajo de 16 (el umbral de negro de blackdetect)
    let run = 0; while (run < vals.length && vals[run] <= 16) run++;
    console.log(`f0 ${f0} · luma ${vals.join(" ")} · RACHA NEGRA ${run} cuadros (${(run / 30).toFixed(2)}s)${run >= 6 ? "  ⛔ dispara blackdetect d=0.2" : ""}`);
  }
}
