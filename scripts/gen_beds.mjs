// scripts/gen_beds.mjs — genera la CAMA (`props.bed`) de cada cue de componente y la
// escribe en el plan. Mecanismo del molde `fcsmanos10` (53/53 con bed → 0 tramos negros).
//
//   node scripts/gen_beds.mjs <slug> [--plan _v3/<slug>_plan.json] [--dry]
//
// La cama de un componente es el asset del PROPIO MOMENTO que ese componente tapa: la
// imagen de b-roll que corresponde al segundo del guion donde cae el beat. Así el gráfico
// se apoya sobre lo que la narración está diciendo, no sobre un relleno.
// Se emite como JPG 1280x720 (`<slug>_NNN_prev_bed.jpg`, igual que el molde): el PNG
// original pesa ~1 MB y son >150 camas — en JPG quedan ~90 KB, que es lo que hace viable
// el tar delta al farm.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const FFMPEG = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe";
const slug = process.argv[2];
if (!slug) { console.error("uso: node scripts/gen_beds.mjs <slug> [--plan ruta] [--dry]"); process.exit(1); }
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes("--dry");
const planPath = arg("--plan", `_v3/${slug}_plan.json`);
if (!fs.existsSync(planPath)) { console.error(`⛔ no existe ${planPath}`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const beats = plan.beats.slice().sort((a, b) => a.ms_in - b.ms_in);
const IMGDIR = `public/img/${slug}`;
const existe = (rel) => fs.existsSync(path.join("public", rel));

// Catálogo de FUENTES por índice de momento. Las imágenes sueltas ya casi no están (una poda
// dejó sólo las que el plan referencia), así que la fuente principal es el propio clip de
// b-roll: le saco un cuadro. Es además la semántica de `_prev_bed` del molde — la cama es el
// plano que el gráfico tapa.
const porIdx = new Map();
const reg = (i, rel, tipo) => { if (!porIdx.has(i)) porIdx.set(i, { rel, tipo }); };
// El nombre del asset cambia por video (`fcspuntos_013.png` vs `a013.png`): lo que importa es
// el NÚMERO de momento, así que acepto cualquier prefijo.
const NUM = /^[A-Za-z_]*?(\d+)\.(png|jpe?g|mp4)$/i;
for (const f of fs.existsSync(IMGDIR) ? fs.readdirSync(IMGDIR) : []) {
  if (/_blur\.|_prev_bed\./i.test(f)) continue;
  const m = f.match(NUM);
  if (m && /\.(png|jpe?g)$/i.test(f)) reg(parseInt(m[1], 10), `img/${slug}/${f}`, "img");
}
const BROLLDIR = `public/broll/${slug}`;
for (const f of fs.existsSync(BROLLDIR) ? fs.readdirSync(BROLLDIR) : []) {
  const m = f.match(NUM);
  if (m && /\.mp4$/i.test(f)) reg(parseInt(m[1], 10), `broll/${slug}/${f}`, "mp4");
}
if (!porIdx.size) { console.error(`⛔ 0 fuentes (ni imágenes en ${IMGDIR} ni clips en ${BROLLDIR})`); process.exit(1); }

// Momento que cubre un instante: el de `_v3/<slug>_moments.json` si está, si no el índice
// del asset de b-roll más cercano hacia atrás en el propio plan.
let moments = null;
const mp = `_v3/${slug}_moments.json`;
if (fs.existsSync(mp)) moments = JSON.parse(fs.readFileSync(mp, "utf8"));

const idxDeAsset = (s) => { const m = String(s || "").match(/(\d+)\.(?:png|jpe?g|mp4)$/i); return m ? parseInt(m[1], 10) : null; };

const idxParaBeat = (b) => {
  const seg = b.ms_in / 1000;
  if (moments) {
    // el momento que CONTIENE ese segundo (o el último que arrancó antes)
    let mejor = null;
    for (const m of moments) if (m.t <= seg && (!mejor || m.t > mejor.t)) mejor = m;
    if (mejor && porIdx.has(mejor.i)) return mejor.i;
  }
  // fallback: el asset del beat de b-roll inmediatamente anterior
  const i = beats.indexOf(b);
  for (let k = i - 1; k >= 0; k--) {
    const idx = idxDeAsset(beats[k].src || beats[k].srcImg);
    if (idx != null && porIdx.has(idx)) return idx;
  }
  return null;
};

// luma media exacta: 1x1 en gris. (`signalstats` NO sirve: va por metadata, no al log.)
const luma = (abs) => {
  try {
    const out = execFileSync(FFMPEG, ["-v", "error", "-i", abs, "-vf", "format=gray,scale=1:1", "-f", "rawvideo", "-"], { stdio: ["ignore", "pipe", "pipe"] });
    return out.length ? out[0] : NaN;
  } catch { return NaN; }
};
const lumas = [];

const comps = beats.filter((b) => b.tipo === "componente");
console.log(`${slug} · ${comps.length} cues de componente · ${porIdx.size} imágenes disponibles`);

let hechos = 0, yaEstaban = 0, sinFuente = 0;
const usados = new Map();
for (const b of comps) {
  if (b.props?.bed && existe(b.props.bed)) { yaEstaban++; continue; }
  const idx = idxParaBeat(b);
  if (idx == null) { sinFuente++; console.error(`   ⛔ sin imagen fuente para ${b.componente} @${(b.ms_in / 1000).toFixed(1)}s`); continue; }
  const src = porIdx.get(idx);
  const bed = `img/${slug}/${slug}_${String(idx).padStart(3, "0")}_prev_bed.jpg`;
  if (!existe(bed) && !DRY) {
    // de un mp4 saco UN cuadro (a 1 s, ya arrancado el movimiento); de un png, la imagen.
    const entrada = src.tipo === "mp4" ? ["-ss", "1", "-i", path.join("public", src.rel), "-frames:v", "1"] : ["-i", path.join("public", src.rel)];
    const dest = path.join("public", bed);
    const escribir = (brillo) => execFileSync(FFMPEG, ["-v", "error", "-y", ...entrada,
      "-vf", `scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720${brillo ? `,eq=brightness=${brillo.toFixed(3)}:contrast=1.04` : ""}`,
      "-q:v", "4", dest]);
    escribir(0);
    // ⚠ NORMALIZACIÓN. `PhotoBed` multiplica por (1-dim) y encima le apoya un scrim, así que
    // una cama que sale de un plano oscuro termina en luma ~0 y vuelve a ser un tramo negro
    // (medido: 2 StampBadge quedaron en YAVG 0 y 3 con la cama SIN normalizar). Llevo cada
    // cama a ~TARGET de luma media para que el piso no dependa de qué tan oscuro era el clip.
    const TARGET = 130;
    let y = luma(dest);
    for (let intento = 0; intento < 3 && Number.isFinite(y) && y < TARGET - 12; intento++) {
      escribir(Math.min(0.6, (TARGET - y) / 255 + 0.02));
      y = luma(dest);
    }
    lumas.push(y);
  }
  b.props = b.props || {};
  b.props.bed = bed;
  usados.set(bed, (usados.get(bed) || 0) + 1);
  hechos++;
}

console.log(`camas nuevas ${hechos} · ya tenían ${yaEstaban} · sin fuente ${sinFuente} · archivos distintos ${usados.size}`);
if (sinFuente) { console.error("⛔ hay componentes sin cama: no sigo"); process.exit(1); }
if (!DRY) {
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 1));
  console.log(`plan actualizado: ${planPath}`);
  const kb = [...usados.keys()].reduce((a, f) => a + fs.statSync(path.join("public", f)).size, 0) / 1024;
  console.log(`peso de las camas: ${(kb / 1024).toFixed(1)} MB en ${usados.size} archivos`);
  const ok = lumas.filter((x) => Number.isFinite(x));
  if (ok.length) console.log(`luma de las camas: min ${Math.min(...ok)} · mediana ${ok.slice().sort((a, b) => a - b)[Math.floor(ok.length / 2)]} · max ${Math.max(...ok)}`);
}
