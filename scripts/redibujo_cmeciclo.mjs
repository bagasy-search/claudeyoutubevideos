// redibujo_cmeciclo.mjs — COMPUERTA: caza los clips que agnes REDIBUJO.
// Misma medicion que scripts/check_redibujo.mjs (frame 0 vs frame a 0,5 s: en medio segundo un
// clip sano casi no cambia; uno redibujado ya es OTRA escena). Variante propia porque la
// compartida asume nombres con sufijo numerico (`name_123.mp4`) y aca son `cmeciclo_mNNN.mp4`.
// ⛔ No se toca la compartida: la usan otras sesiones.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SLUG = "cmeciclo", UMBRAL = +(process.argv[2] || 0.35);
const dir = `public/broll/${SLUG}`, W = 64, H = 36;
const grab = (f, ss) => {
  try {
    return execFileSync("ffmpeg", ["-v", "error", ...(ss ? ["-ss", String(ss)] : []), "-i", f,
      "-frames:v", "1", "-vf", `scale=${W}:${H},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1e7 });
  } catch { return null; }
};
const norm = (b) => {
  const o = Float64Array.from(b);
  let m = 0; for (const v of o) m += v; m /= o.length;
  let s = 0; for (const v of o) s += (v - m) * (v - m); s = Math.sqrt(s / o.length) || 1;
  for (let i = 0; i < o.length; i++) o[i] = (o[i] - m) / s;
  return o;
};
// solo los clips GENERADOS: el stock real no lo redibuja nadie
const files = fs.readdirSync(dir).filter((x) => x.endsWith(".mp4") && !x.endsWith("_st.mp4")).sort();
const out = [];
for (const f of files) {
  const p = `${dir}/${f}`;
  const A = grab(p, 0), B = grab(p, 0.5);
  if (!A || !B) { out.push([f, -1]); continue; }
  const a = norm(A), b = norm(B);
  let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
  out.push([f, d / a.length]);
}
const malos = out.filter((x) => x[1] > UMBRAL);
const ilegibles = out.filter((x) => x[1] < 0);
console.log(`medidos ${out.length} clips generados (umbral ${UMBRAL})`);
const v = out.filter((x) => x[1] >= 0).map((x) => x[1]).sort((a, b) => a - b);
console.log(`salto 0→0,5s: mediana ${v[v.length >> 1].toFixed(3)} · p90 ${v[Math.floor(v.length * 0.9)].toFixed(3)} · max ${v.at(-1).toFixed(3)}`);
console.log(`REDIBUJADOS: ${malos.length} (${((malos.length / out.length) * 100).toFixed(0)}%) · ilegibles ${ilegibles.length}`);
for (const [f, d] of malos.sort((a, b) => b[1] - a[1])) console.log(`  ${d.toFixed(3)}  ${f}`);
fs.writeFileSync(`_v3/${SLUG}_redibujados.json`, JSON.stringify(malos.map((x) => x[0]), null, 1));
