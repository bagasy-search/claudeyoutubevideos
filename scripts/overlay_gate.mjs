// scripts/overlay_gate.mjs — COMPUERTA DE NEGROS, previa al farm.
//
// Por qué existe (ver _BUGS_fed6_integracion.md #6): varios componentes del kit _fed6 son
// OVERLAY PURO — no pintan fondo, esperan footage debajo. Montados como cue BASE quedan
// segundos de pantalla negra. El barrido viejo no los veía por DOS motivos:
//   1) renderizaba UN frame del MEDIO del beat. `StampBadge` slamea recién en el frame 8,
//      así que el negro está en el ARRANQUE y al medio ya hay sello: pasaba limpio.
//   2) sólo miraba si el render tiraba excepción, no si la imagen estaba NEGRA.
//
// Esta compuerta renderiza el frame de ARRANQUE y el del MEDIO de cada beat de componente y
// mide la luminancia media (YAVG de ffmpeg signalstats). Cualquier frame por debajo del umbral
// es un candidato a tramo negro en el mp4 → falla ANTES de gastar 40 min de farm.
//
//   node scripts/overlay_gate.mjs <slug> [--comp Comp1,Comp2] [--min 24]
//
// ⚠ Es la contraparte LOCAL del `blackdetect` del auditor: el auditor mide el mp4 YA hecho,
//   ésta mide el JSX antes de rendear. Las dos tienen que estar verdes.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

process.env.TEMP = "D:/rtmp/tmp"; process.env.TMP = "D:/rtmp/tmp"; process.env.TMPDIR = "D:/rtmp/tmp";
const FFMPEG = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";

const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/overlay_gate.mjs <slug> [--comp A,B] [--min 24]"); process.exit(1); }
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const MIN = parseFloat(arg("--min", "24"));
const soloComp = (arg("--comp", "") || "").split(",").filter(Boolean);

const FPS = 30;
// El montaje vive en el Main (_fed6 nuevo) o en un cues_*.gen.tsx (montaje viejo).
const CANDIDATOS = [`src/_fed6/VideoEdit/Main_${slug}.tsx`, `src/VideoEdit/cues_${slug}.gen.tsx`];
const fuente = CANDIDATOS.filter((f) => fs.existsSync(f)).map((f) => ({ f, src: fs.readFileSync(f, "utf8") }));
if (!fuente.length) { console.error(`⛔ no encuentro el montaje de ${slug} (${CANDIDATOS.join(" ni ")})`); process.exit(1); }

// `startSec:` en el Main nuevo, `start:` en el cues_*.gen viejo. El `el` puede ser un
// componente suelto o un FRAGMENTO (`<><ReframedVideo …/><PremiumOverlay>…`).
const beats = [];
for (const { f, src } of fuente) {
  const re = /key:\s*"(componente_\d+)",\s*start(?:Sec)?:\s*([\d.]+),\s*dur:\s*([\d.]+),\s*el:\s*\((?:d|d: number)\) => (.*)$/gm;
  for (const m of src.matchAll(re)) {
    const [, key, start, dur, el] = m;
    const comp = el.startsWith("<>")
      ? (el.match(/<PremiumOverlay[^>]*><(\w+)/) || el.match(/<(\w+)/) || [, "Fragmento"])[1]
      : (el.match(/^<(\w+)/) || [, "Desconocido"])[1];
    if (soloComp.length && !soloComp.includes(comp)) continue;
    const f0 = Math.round(parseFloat(start) * FPS), nf = Math.max(1, Math.round(parseFloat(dur) * FPS));
    beats.push({ key, comp, archivo: f, f0, nf });
  }
}
if (!beats.length) { console.error("⛔ 0 beats de componente: revisá la regex contra el montaje"); process.exit(1); }
console.log(`${slug} · ${beats.length} beats de componente · ${new Set(beats.map((b) => b.comp)).size} tipos · umbral YAVG ${MIN}`);

const OUT = `D:/rtmp/${slug}_overlaygate`;
fs.mkdirSync(OUT, { recursive: true });

// Luminancia media del PNG: lo reduzco a 1x1 en gris y leo el byte.
// ⛔ NO usar `signalstats`: sus métricas salen por METADATA, no al log, así que el YAVG no
//    aparece ni con `-v info` y "no pude medir" se confunde con "todo bien". Esto es exacto.
const yavg = (png) => {
  try {
    const out = execFileSync(FFMPEG, ["-v", "error", "-i", png, "-vf", "format=gray,scale=1:1", "-f", "rawvideo", "-"],
      { stdio: ["ignore", "pipe", "pipe"] });
    return out.length ? out[0] : NaN;
  } catch { return NaN; }
};

const entry = fs.existsSync(`src/index_${slug}.tsx`) ? `src/index_${slug}.tsx` : "src/Root.tsx";
const serveUrl = await bundle({ entryPoint: path.resolve(entry), onProgress: () => {} });
const compId = slug.charAt(0).toUpperCase() + slug.slice(1);
const composition = await selectComposition({ serveUrl, id: compId });
console.log(`bundle OK · composición ${compId}`);

const oscuros = [], errores = [];
let ok = 0;
for (const b of beats) {
  // ARRANQUE (+1 para no caer en el corte exacto) y MEDIO del beat.
  const puntos = [["ini", b.f0 + 1], ["med", b.f0 + Math.max(1, Math.floor(b.nf / 2))]];
  for (const [etiqueta, frame] of puntos) {
    const png = path.join(OUT, `${b.comp}_${b.f0}_${etiqueta}.png`);
    try {
      await renderStill({ serveUrl, composition, frame, output: png, overwrite: true, scale: 0.35 });
      const y = yavg(png);
      if (!Number.isFinite(y)) { errores.push(`${b.comp}@f${frame}: no pude medir YAVG`); continue; }
      if (y < MIN) oscuros.push({ comp: b.comp, key: b.key, frame, etiqueta, y, seg: +(frame / FPS).toFixed(2) });
      else ok++;
    } catch (e) {
      errores.push(`${b.comp}@f${frame}: ${String(e.message || e).split("\n")[0].slice(0, 160)}`);
    }
  }
}

console.log(`\n=== COMPUERTA DE NEGROS · ${slug} · frames claros ${ok} · oscuros ${oscuros.length} · errores ${errores.length} ===`);
if (errores.length) { console.log("ERRORES DE RENDER:"); errores.slice(0, 8).forEach((e) => console.log("  ⛔ " + e)); }
if (oscuros.length) {
  const porComp = {};
  for (const o of oscuros) (porComp[o.comp] = porComp[o.comp] || []).push(o);
  console.log("FRAMES OSCUROS (candidatos a tramo negro en el mp4):");
  for (const [c, lista] of Object.entries(porComp).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ⛔ ${c} · ${lista.length} frames · YAVG ${Math.min(...lista.map((l) => l.y)).toFixed(1)}–${Math.max(...lista.map((l) => l.y)).toFixed(1)}`);
    lista.slice(0, 6).forEach((l) => console.log(`       ${l.etiqueta} @${l.seg}s (frame ${l.frame}) YAVG ${l.y.toFixed(1)}  ${l.key}`));
  }
}
if (oscuros.length || errores.length) process.exit(1);
console.log("✅ sin frames negros — podés rendear.");
