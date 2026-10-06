// Compositor de texto de las miniaturas de Dr. Bastida.
// La FOTO sale de gpt-image-2 SIN una sola letra; la tipografia se pone aca para
// controlar cuerpo, peso y sombra (gpt-image dibuja letra gorda con contorno sucio).
//
//   node scripts/_bas_thumbs_text.mjs            -> compone todas las que existan
//   node scripts/_bas_thumbs_text.mjs 03_limon   -> solo esa
//
// Sistema: 2 lineas maximo. Kicker Barlow Condensed Medium ambar, payoff SemiBold blanco.
// Sin contorno: sombra suave (gblur) + scrim degradado a la izquierda. Marca arriba a la derecha.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIR = "_basthumbs";
const RAW = `${DIR}/raw`, OUT = `${DIR}/out`, TMP = `${DIR}/tmp`;
for (const d of [OUT, TMP]) fs.mkdirSync(d, { recursive: true });

const F_SEMI = path.resolve(`${DIR}/fonts/BarlowCondensed-SemiBold.ttf`).replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
const F_MED = path.resolve(`${DIR}/fonts/BarlowCondensed-Medium.ttf`).replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");

const W = 1792, H = 1008;
const MARGIN = 96;          // margen izquierdo fijo en las 9 = la marca del canal
const AMBER = "0xF2A23C";
const KICK_SIZE = 64;
const PAY_SIZE = 138;
const BRAND = "Doc Bastida";

// tope del bloque de texto. Abajo por defecto; arriba cuando el objeto heroe ocupa
// la esquina inferior izquierda (pescados/agua/tobillo).
const BLOCK_BOTTOM = 660, BLOCK_TOP = 76;

const JOBS = {
  "01_pescados": { kicker: "OJO CON LA LATA", payoff: "LE TAPA EL FILTRO", pos: "top" },
  "02_heladera": { kicker: "ESTÁ EN SU HELADERA", payoff: "AHORA MISMO" },
  "03_limon": { kicker: "ES LA HORA", payoff: "NO ES EL LIMÓN", swap: true },
  "04_agua": { kicker: "y a los 60, menos", payoff: "NO SON 2 LITROS", swap: true, lowerKick: true, pos: "top" },
  "05_tes": { kicker: "EL DE TODOS LOS DÍAS", payoff: "LE HACE PIEDRAS" },
  "06_analisis": { kicker: "SU ANÁLISIS DICE “NORMAL”", payoff: "Y NO LO ESTÁ" },
  "07_tobillo": { kicker: "LA MARCA DEL CALCETÍN", payoff: "NO ES POR EL CALOR", pos: "top" },
  "08_sal": { kicker: "LA SAL “LIGHT”", payoff: "ES LA PEOR DE TODAS" },
  "09_desayuno": { kicker: "EL DESAYUNO “SANO”", payoff: "ES EL MÁS DAÑINO" },
};

const only = process.argv[2];
const names = Object.keys(JOBS).filter((n) => !only || n === only);

for (const name of names) {
  const src = `${RAW}/${name}.png`;
  if (!fs.existsSync(src)) { console.log("· falta la foto:", name); continue; }
  const j = JOBS[name];

  // los textos van por archivo: drawtext + acentos/comillas por linea de comandos = infierno
  const fk = `${TMP}/${name}_k.txt`, fp = `${TMP}/${name}_p.txt`, fb = `${TMP}/${name}_b.txt`;
  fs.writeFileSync(fk, j.kicker, "utf8");
  fs.writeFileSync(fp, j.payoff, "utf8");
  fs.writeFileSync(fb, BRAND, "utf8");
  const tf = (p) => path.resolve(p).replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");

  // swap = el payoff va arriba y el kicker debajo (lee mejor cuando el kicker remata)
  const blockY = j.pos === "top" ? BLOCK_TOP : BLOCK_BOTTOM;
  const yPay = j.swap ? blockY : blockY + 74;
  const yKick = j.swap ? blockY + 158 : blockY;
  const kickSize = j.lowerKick ? KICK_SIZE + 4 : KICK_SIZE;

  const dtKick = `drawtext=fontfile='${F_MED}':textfile='${tf(fk)}':fontcolor=${AMBER}:fontsize=${kickSize}:x=${MARGIN}:y=${yKick}`;
  const dtPay = `drawtext=fontfile='${F_SEMI}':textfile='${tf(fp)}':fontcolor=white:fontsize=${PAY_SIZE}:x=${MARGIN - 6}:y=${yPay}`;
  // la marca lleva sombra propia: sin ella desaparece cuando la esquina cae sobre una ventana
  const dtBrand = `drawtext=fontfile='${F_MED}':textfile='${tf(fb)}':fontcolor=white@0.80:fontsize=36:x=w-tw-40:y=34:shadowcolor=black@0.55:shadowx=2:shadowy=2`;

  const fc = [
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1[base]`,
    // scrim: oscurece SOLO la izquierda, degradado largo, para que el blanco pegue sin contorno
    `color=c=black:s=${W}x${H},format=rgba,geq=r=0:g=0:b=0:a='255*0.60*pow(max(0\\,1-X/1080)\\,1.3)'[scrim]`,
    `[base][scrim]overlay=0:0[bg]`,
    // capa de texto transparente -> copia negra desenfocada = sombra suave (no contorno)
    `color=c=black@0:s=${W}x${H},format=rgba,${dtKick},${dtPay}[txt]`,
    `[txt]split=2[t1][t2]`,
    `[t2]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.62,gblur=sigma=16[sh]`,
    `[bg][sh]overlay=0:8[bgs]`,
    `[bgs][t1]overlay=0:0[withtxt]`,
    `[withtxt]${dtBrand},scale=1920:1080:flags=lanczos[outv]`,
  ].join(";");

  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-filter_complex", fc,
    "-map", "[outv]", "-frames:v", "1", "-q:v", "2", `${OUT}/${name}.jpg`]);
  console.log("✓", name, "·", j.kicker, "/", j.payoff);
}
console.log("salida:", OUT);
