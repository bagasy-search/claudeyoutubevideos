// verif_clembudo.mjs — COMPUERTAS SOBRE EL MP4 YA RENDIDO.
//
//   node scripts/verif_clembudo.mjs D:/videosdeclaude/clembudo.mp4
//
// Mide lo que sólo se puede medir sobre el archivo final y deja los frames que hay que MIRAR:
//   1. duración y frames
//   2. blackdetect
//   3. luma media cada 4 s → 0 instantes con YAVG < 45
//   4. el QR decodificado de las dos ventanas del CTA
//   5. extrae un frame al 80 % de la ventana de CADA componente y de CADA acto de los movimientos
//      ⚠️ al 80 %, NUNCA al arranque: los componentes del kit revelan con staggers y al principio
//      están a medio dibujar — parecen rotos sin estarlo.
//
// ⛔ Los siete defectos de esta rehechura NO disparan ninguna compuerta automática. Los números de
// acá dicen que el archivo está sano; que esté BIEN se decide mirando los frames del paso 5.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

const MP4 = process.argv[2] || "D:/videosdeclaude/clembudo.mp4";
const OUT = process.argv[3] || "D:/rtmp/tmp/claude/verif";
if (!existsSync(MP4)) { console.error(`✗ no existe ${MP4}`); process.exit(1); }
mkdirSync(OUT, { recursive: true });
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 1 << 28 });
const quiet = (c) => { try { return sh(c); } catch (e) { return (e.stdout || "") + (e.stderr || ""); } };

let fallos = 0;
const ok = (cond, txt) => { console.log(`  ${cond ? "✅" : "⛔"} ${txt}`); if (!cond) fallos++; };

// ── 1 · duración ────────────────────────────────────────────────────────────────────────────
const probe = JSON.parse(sh(`ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,r_frame_rate,width,height -show_entries format=duration -of json "${MP4}"`));
const dur = +probe.format.duration;
const nbf = +probe.streams[0].nb_frames;
console.log(`\n── clembudo · ${dur.toFixed(2)}s · ${nbf} frames · ${probe.streams[0].width}x${probe.streams[0].height}`);
ok(Math.abs(dur - 731.17) < 0.6, `duración 731,17 s ±0,6  (medido ${dur.toFixed(2)})`);
ok(Math.abs(nbf - 21935) <= 2, `21.935 frames ±2  (medido ${nbf})`);

// ── 2 · blackdetect ─────────────────────────────────────────────────────────────────────────
const bd = quiet(`ffmpeg -v info -i "${MP4}" -vf "blackdetect=d=0.12:pic_th=0.98" -an -f null - 2>&1`);
const negros = [...bd.matchAll(/black_start:([\d.]+)/g)].map((m) => +m[1]);
ok(negros.length === 0, `blackdetect: ${negros.length} tramos negros${negros.length ? " → " + negros.slice(0, 6).join(", ") : ""}`);

// ── 3 · luma media cada 4 s ─────────────────────────────────────────────────────────────────
// ⚠️ Un cuadro "oscuro y vacío" NO llega a ser negro: blackdetect da CERO y pasa igual. Por eso
// además de blackdetect va la luma, que es la que agarró los 6 instantes del render anterior.
// ⚠️ UNA SOLA PASADA. La primera versión lanzaba un ffprobe por muestra con
// `select=gte(t,N)`: cada uno vuelve a decodificar desde el frame 0, o sea 183 decodificaciones de
// un mp4 de 460 MB. No terminó en 10 minutos. Con `fps=1/4` + `metadata=print` es una pasada sola.
const paso = 4;
const raw = quiet(`ffmpeg -v error -i "${MP4}" -vf "fps=1/${paso},signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -an -f null - 2>&1`);
const lum = [...raw.matchAll(/pts_time:([\d.]+)[\s\S]*?YAVG=([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
const bajos = lum.filter(([, y]) => y < 45);
const medidos = lum.length;
ok(medidos > 150, `luma: ${medidos} instantes medidos (cada ${paso}s) — si esto es 0, la compuerta no miró nada`);
ok(bajos.length === 0, `luma: ${bajos.length} de ${medidos} instantes con YAVG < 45${bajos.length ? " → " + bajos.slice(0, 8).map(([t, y]) => `${t.toFixed(0)}s:${y.toFixed(0)}`).join(", ") : ""}`);
if (medidos) {
  const ys = lum.map(([, y]) => y).sort((a, b) => a - b);
  console.log(`     (mín ${ys[0].toFixed(1)} · mediana ${ys[ys.length >> 1].toFixed(1)} · máx ${ys[ys.length - 1].toFixed(1)})`);
}

// ── 4 · el QR de las dos ventanas del CTA ───────────────────────────────────────────────────
console.log(`\n── QR (se decodifica a mano con un lector; acá quedan los frames)`);
for (const t of [298.5, 724.5]) {
  const p = `${OUT}/qr_${t}.png`;
  quiet(`ffmpeg -v error -ss ${t - 0.5} -i "${MP4}" -ss 0.5 -frames:v 1 -y "${p}"`);
  console.log(`  ${t}s → ${p}   (esperado: https://www.constructorlibre.com/curso)`);
}

// ── 5 · UN FRAME AL 80 % DE CADA VENTANA ────────────────────────────────────────────────────
// ⛔ Al 80 %, nunca al arranque. Y también los actos de los movimientos, que es donde vivían los
// siete defectos: ninguno de ellos se ve en un número, todos se ven mirando.
const comps = JSON.parse(readFileSync("_v3/clembudo_comps.json", "utf8").replace(/^\uFEFF/, ""));
const ACTOS = {
  MovTresAguas: [199.5, [0, 208, 596, 1051, 1301, 1470]],
  MovCloroBorax: [305.5, [0, 288, 690, 916, 1280, 1618]],
  MovCuatroPasos: [373.5, [0, 145, 542, 674, 1317, 1445]],
  MovDinero: [457.2, [0, 146, 410, 505, 759]],
  MovCaso35: [489.4, [0, 200, 590, 812, 1047, 1232]],
  MovCierre: [653.0, [0, 117, 369, 663, 973, 1141]],
};
console.log(`\n── frames a MIRAR → ${OUT}`);
const shots = [];
for (const c of comps) {
  const t = (c.ms_in + (c.ms_out - c.ms_in) * 0.8) / 1000;
  shots.push([`comp_${c.componente}_${t.toFixed(1)}`, t]);
}
for (const [mov, [base, actos]] of Object.entries(ACTOS)) {
  actos.forEach((fa, i) => {
    const fin = actos[i + 1] ?? fa + 120;
    const t = base + (fa + (fin - fa) * 0.6) / 30;
    shots.push([`${mov}_A${i + 1}_${t.toFixed(1)}`, t]);
  });
}
for (const [name, t] of shots) {
  // ⚠️ -ss a LOS DOS LADOS del -i: el de antes salta rápido, el de después decodifica exacto.
  quiet(`ffmpeg -v error -ss ${(t - 0.5).toFixed(2)} -i "${MP4}" -ss 0.5 -frames:v 1 -vf scale=960:-2 -y "${OUT}/${name}.jpg"`);
}
console.log(`  ${shots.length} frames extraídos (${comps.length} componentes + ${shots.length - comps.length} actos de movimiento)`);

console.log(`\n${fallos ? `⛔ ${fallos} compuerta(s) en rojo` : "✅ las compuertas numéricas pasan"} — ahora hay que MIRAR los frames de ${OUT}`);
process.exit(fallos ? 1 : 0);
