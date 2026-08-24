/**
 * build_bastida6.mjs — arma la capa de B-ROLL de `Main_bastida6` desde los beats de Whisper
 * y la lista de clips de agnes. Sale `src/bastida/beats6.json`.
 *
 * REGLA ANTI-HUECO (video-pipeline §1): el avatar es el FONDO garantizado. Cada contenido cubre
 * SOLO su cobertura REAL: cov = min(hueco, duracion real del clip - 0.1s, techo). Si el clip de
 * agnes no llego, cae a su FOTO de respaldo (bas6_p_<name>) — pero la foto tiene techo mas corto,
 * porque una foto quieta de 11 s es un pase de diapositivas, no una edicion.
 *
 * PACING (video-pipeline regla 1): mediana 3,5-4,5 s · ~40% de planos >=5 s · techo ~12 s.
 * Ultima pasada: rellena los huecos del tramo B (donde el avatar esta en bucle y no hay lipsync).
 *
 *   node scripts/build_bastida6.mjs
 */
import fs from "node:fs";
import {execFileSync} from "node:child_process";

const FPS = 30;
const TOTAL = 41115;
const SEAM = 16697;
const CAP_CLIP = 330;   // 11 s
const CAP_PHOTO = 240;  // 8 s con Ken Burns; el ritmo lo da la VARIEDAD, no el techo bajo
const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const beats = R("_v3/bastidarenal6_beats.json");
const clips = [...R("_v3/bastidarenal6_clips_A.json"), ...R("_v3/bastidarenal6_clips_B.json")];
const DEPTH_SPANS = R("_v3/bastidarenal6_depth.json");

const frameOf = (i) => Math.round((beats[i].startMs * FPS) / 1000);
const endOf = (i) => Math.round((beats[i].endMs * FPS) / 1000);
const probeCache = {};
function probe(f) {
  if (probeCache[f] != null) return probeCache[f];
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], {encoding: "utf8"});
    return (probeCache[f] = parseFloat(out.trim()));
  } catch { return (probeCache[f] = 0); }
}
const hasImg = (n) => fs.existsSync(`public/img/${n}.jpg`) || fs.existsSync(`public/img/${n}.png`);
// BRoll respeta la extension si el nombre la trae: preferimos .jpg (el tar pesa 10x menos)
const imgRef = (n) => (fs.existsSync(`public/img/${n}.jpg`) ? `${n}.jpg` : `${n}.png`);

const out = [];
let missClip = 0, missBoth = 0;
const sinNada = [];
for (const c of clips) {
  const name = c.name;
  const photo = name.replace("bas6_c_", "bas6_p_");
  const mp4 = `public/broll/${name}.mp4`;
  const hasClip = fs.existsSync(mp4);
  if (!hasClip) missClip++;
  if (!hasClip && !hasImg(photo)) { missBoth++; sinNada.push(photo); continue; }

  const b0 = c.beats[0];
  if (b0 == null || !beats[b0]) continue;
  const from = frameOf(b0);
  const bl = c.beats[c.beats.length - 1];
  const slot = Math.max(60, endOf(bl) - from);
  const dur = hasClip
    ? Math.min(slot, Math.max(0, Math.round(probe(mp4) * FPS) - 3), CAP_CLIP)
    : Math.min(slot, CAP_PHOTO);
  if (dur < 45) continue;
  out.push(hasClip ? {from, dur, clip: name} : {from, dur, img: imgRef(photo)});
  // cola: el clip dura 4 s; si el hueco da para mas, lo termina su foto (mismo prompt, mismo tema)
  if (hasClip && hasImg(photo) && slot - dur >= 105) {
    out.push({from: from + dur, dur: Math.min(slot - dur, 240), img: imgRef(photo)});
  }
}

out.sort((a, b) => a.from - b.from);
for (let i = 1; i < out.length; i++) {
  const prev = out[i - 1];
  if (prev.from + prev.dur > out[i].from) prev.dur = Math.max(45, out[i].from - prev.from);
}
let kept = out.filter((x) => x.dur >= 45);

/* ---- pasada de RELLENO: en el tramo B el avatar esta en bucle (sin lipsync); ningun hueco largo ---- */
const spans = [...DEPTH_SPANS.map(([s, d]) => [s, s + d]), ...kept.map((x) => [x.from, x.from + x.dur])].sort((a, b) => a[0] - b[0]);
const merged = [];
for (const s of spans) {
  const last = merged[merged.length - 1];
  if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
  else merged.push([...s]);
}
// pool de relleno: heroes + fotos de respaldo que no quedaron usadas
const usadas = new Set(kept.map((x) => x.img).filter(Boolean).map((n) => n.replace(/\.(jpg|png)$/, '')));
const pool = fs.readdirSync("public/img")
  .filter((f) => /^bas6_(p|broll|lino|chia|cilantro|girasol|sesamo|zapallo|ramon|elena|lamina)/.test(f) && /\.(jpg|png)$/.test(f))
  .map((f) => f.replace(/\.(jpg|png)$/, ""))
  .filter((n) => !usadas.has(n));
let pi = 0;
const fills = [];
let cursor = SEAM;
for (const [a, b] of merged) {
  if (b <= SEAM) continue;
  const gapStart = Math.max(cursor, SEAM);
  if (a - gapStart >= 90 && pool.length) {
    let t = gapStart;
    while (a - t >= 90) {
      const LARGOS = [150, 240, 180, 300, 165, 210]; // 5 / 8 / 6 / 10 / 5,5 / 7 s
      const d = Math.min(a - t, LARGOS[pi % LARGOS.length]);
      fills.push({from: t, dur: d, img: imgRef(pool[pi++ % pool.length])});
      t += d;
    }
  }
  cursor = Math.max(cursor, b);
}
if (TOTAL - cursor >= 90 && pool.length) {
  let t = cursor;
  while (TOTAL - t >= 90) {
    const d = Math.min(TOTAL - t, [150, 240, 180, 300, 165, 210][pi % 6]);
    fills.push({from: t, dur: d, img: imgRef(pool[pi++ % pool.length])});
    t += d;
  }
}
kept = [...kept, ...fills].sort((a, b) => a.from - b.from);

fs.writeFileSync("src/bastida/beats6.json", JSON.stringify(kept, null, 0));

/* ---- reporte / compuertas ---- */
const cells = Math.ceil(TOTAL / 6);
const covered = new Array(cells).fill(false);
const mark = (a, b) => { for (let t = Math.floor(a / 6); t < Math.ceil(b / 6); t++) if (t >= 0 && t < cells) covered[t] = true; };
kept.forEach((x) => mark(x.from, x.from + x.dur));
DEPTH_SPANS.forEach(([s, d]) => mark(s, s + d));
const cutA = Math.ceil(SEAM / 6);
const covA = covered.slice(0, cutA).filter(Boolean).length / cutA;
const covB = covered.slice(cutA).filter(Boolean).length / (cells - cutA);
const durs = kept.map((x) => x.dur / FPS).sort((a, b) => a - b);
const q = (p) => durs[Math.floor(durs.length * p)] ?? 0;
console.log(`b-roll: ${kept.length} (clips ${kept.filter((x) => x.clip).length} · fotos ${kept.filter((x) => x.img).length}, de los cuales relleno ${fills.length})`);
console.log(`clips faltantes ${missClip} · sin clip NI foto ${missBoth}${sinNada.length ? " -> " + sinNada.join(",") : ""}`);
console.log(`cobertura A (avatar real) ${(covA * 100).toFixed(0)}% · B (avatar en bucle) ${(covB * 100).toFixed(0)}%`);
console.log(`planos: mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · p90 ${q(0.9).toFixed(2)}s · >=5s ${((durs.filter((d) => d >= 5).length / durs.length) * 100).toFixed(0)}%`);
