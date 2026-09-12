// intruso_cmeciclo.mjs — COMPUERTA: agnes mete gente que NO es el presentador, y entra TARDE.
//
// ⛔ El chequeo de redibujo compara frame 0 contra el de 0,5 s. Eso caza el corte de escena
// inmediato, pero NO caza a alguien que CAMINA HACIA ADENTRO del cuadro al segundo 2 o 3.
// Medido en `cmeciclo`: dos clips pasaron el chequeo de redibujo en verde y en el render aparece
// un señor de barba blanca que no es Claudio. Lo vio el creador, no la compuerta.
//
// Acá se compara el frame 0 contra VARIOS instantes y se toma el MÁXIMO. Un clip sano se mueve
// poco durante todo el take; uno con alguien entrando salta en el instante en que entra.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const UMBRAL = +(process.argv[2] || 0.35);
const PATRON = process.argv[3] || String.raw`^cmeciclo_n[0-9]+[.]mp4$`;
const dir = "public/broll/cmeciclo", W = 64, H = 36;
const INSTANTES = [0.5, 1.2, 2.0, 2.8, 3.6, 4.4];

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
const dif = (A, B) => {
  const a = norm(A), b = norm(B);
  let d = 0; for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
  return d / a.length;
};

const re = new RegExp(PATRON);
const files = fs.readdirSync(dir).filter((x) => re.test(x)).sort();
const filas = [];
for (const f of files) {
  const p = `${dir}/${f}`;
  const A = grab(p, 0);
  if (!A) { filas.push([f, -1, -1]); continue; }
  let peor = 0, cuando = 0;
  for (const t of INSTANTES) {
    const B = grab(p, t);
    if (!B) continue;
    const d = dif(A, B);
    if (d > peor) { peor = d; cuando = t; }
  }
  filas.push([f, peor, cuando]);
}
const malos = filas.filter((x) => x[1] > UMBRAL);
console.log(`medidos ${filas.length} clips en ${INSTANTES.length} instantes cada uno (umbral ${UMBRAL})`);
const v = filas.filter((x) => x[1] >= 0).map((x) => x[1]).sort((a, b) => a - b);
if (v.length) console.log(`salto MAXIMO: mediana ${v[v.length >> 1].toFixed(3)} · p90 ${v[Math.floor(v.length * 0.9)].toFixed(3)}`);
console.log(`SOSPECHOSOS: ${malos.length}`);
for (const [f, d, t] of malos.sort((a, b) => b[1] - a[1])) console.log(`  ${d.toFixed(3)} a los ${t}s  ${f}`);
fs.writeFileSync("_v3/cmeciclo_intrusos.json", JSON.stringify(malos.map((x) => x[0]), null, 1));
process.exit(malos.length ? 1 : 0);
