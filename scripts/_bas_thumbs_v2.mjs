// Capa de texto v2 — CTR alto SIN volver al contorno gordo.
// Lo que grita no es el trazo: es la ESCALA, el PESO y una PLACA de color solida.
// Estructura: kicker chico + linea grande blanca + linea grande dentro de una placa.
// La placa la ajusta drawtext solo (box=1 + boxborderw), asi que no hay que medir texto.
//
//   node scripts/_bas_thumbs_v2.mjs probe        -> 3 variantes sobre 02_heladera
//   node scripts/_bas_thumbs_v2.mjs all <A|B|C>  -> aplica la variante elegida a las 9
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIR = "_basthumbs";
const RAW = `${DIR}/raw`, OUT = `${DIR}/out`, TMP = `${DIR}/tmp`, PROBE = `${DIR}/probe`;
for (const d of [OUT, TMP, PROBE]) fs.mkdirSync(d, { recursive: true });

const esc = (p) => path.resolve(p).replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
const FONT = {
  anton: esc(`${DIR}/fonts/Anton-Regular.ttf`),
  barlowXB: esc(`${DIR}/fonts/BarlowCondensed-ExtraBold.ttf`),
  barlowMed: esc(`${DIR}/fonts/BarlowCondensed-Medium.ttf`),
};

const W = 1792, H = 1008;
const MX = 88;                 // margen izquierdo fijo en las 9
const AMBER = "0xF2A23C";
const RED = "0xD64541";
const INK = "0x11161C";        // casi negro, para texto sobre placa clara
const BRAND = "Doc Bastida";

let seq = 0;
const tfile = (s) => { const p = `${TMP}/t${seq++}.txt`; fs.writeFileSync(p, s, "utf8"); return esc(p); };

// una linea de texto; si lleva `plate` sale dentro de un bloque solido ajustado al texto
function line({ text, font, size, color, x, y, plate = null, pad = 20 }) {
  const o = [`fontfile='${font}'`, `textfile='${tfile(text)}'`, `fontcolor=${color}`,
    `fontsize=${size}`, `x=${x}`, `y=${y}`];
  if (plate) o.push(`box=1`, `boxcolor=${plate}`, `boxborderw=${pad}`);
  return `drawtext=${o.join(":")}`;
}

// VARIANTES ------------------------------------------------------------------
// A · placa AMBAR en el remate, Anton, bloque apoyado abajo
// B · placa ROJA en el remate + kicker sobre placa oscura, Oswald
// C · sin placa: dos lineas enormes, la 2a en AMBAR solido, Anton, pegado al borde
function layout(v, j) {
  const bottom = j.pos === "top" ? null : 1008;
  if (v === "A") {
    const f = FONT.anton, S = 150, gap = 168;
    const yPlate = bottom ? bottom - 96 - S * 1.18 : 300;
    const yBig = yPlate - gap;
    const yKick = yBig - 82;
    return [
      line({ text: j.kicker, font: FONT.barlowMed, size: 56, color: `white@0.92`, x: MX, y: yKick }),
      line({ text: j.l1, font: f, size: S, color: "white", x: MX - 4, y: yBig }),
      line({ text: j.l2, font: f, size: S, color: INK, x: MX + 12, y: yPlate, plate: AMBER, pad: 22 }),
    ];
  }
  if (v === "B") {
    const f = FONT.barlowXB;
    // auto-ajuste: Barlow Condensed ExtraBold avanza ~0.46em por mayuscula. Ninguna linea
    // puede pasar de SAFE_X o se mete debajo del doctor (siempre esta a la derecha).
    const SAFE_X = 1265;
    const fit = (t, max) => Math.min(max, Math.floor((SAFE_X - MX) / (0.46 * t.length)));
    const S = Math.min(154, fit(j.l1, 154), fit(j.l2, 154));
    const gap = Math.round(S * 1.14);
    const yPlate = bottom ? bottom - 96 - S * 1.2 : 306;
    const yBig = yPlate - gap;
    const yKick = yBig - 96;
    return [
      line({ text: j.kicker, font: f, size: fit(j.kicker, 54), color: INK, x: MX + 10, y: yKick, plate: AMBER, pad: 14 }),
      line({ text: j.l1, font: f, size: S, color: "white", x: MX - 2, y: yBig }),
      line({ text: j.l2, font: f, size: S, color: "white", x: MX + 12, y: yPlate, plate: RED, pad: 20 }),
    ];
  }
  // C
  const f = FONT.anton, S = 168, gap = 178;
  const y2 = bottom ? bottom - 104 - S : 300;
  const y1 = y2 - gap;
  const yKick = y1 - 80;
  return [
    line({ text: j.kicker, font: FONT.barlowMed, size: 56, color: `white@0.9`, x: MX, y: yKick }),
    line({ text: j.l1, font: f, size: S, color: "white", x: MX - 4, y: y1 }),
    line({ text: j.l2, font: f, size: S, color: AMBER, x: MX - 4, y: y2 }),
  ];
}

function render(src, dst, v, j) {
  const dts = layout(v, j).join(",");
  const brand = `drawtext=fontfile='${FONT.barlowMed}':textfile='${tfile(BRAND)}':fontcolor=white@0.8:fontsize=36:x=w-tw-40:y=34:shadowcolor=black@0.55:shadowx=2:shadowy=2`;
  // scrim mas fuerte y mas alto/bajo segun donde caiga el bloque, para que el blanco pegue sin contorno
  const dir = j.pos === "top" ? `pow(max(0\\,1-Y/620)\\,1.1)` : `pow(max(0\\,(Y-260)/748)\\,0.9)`;
  const fc = [
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1[base]`,
    `color=c=black:s=${W}x${H},format=rgba,geq=r=0:g=0:b=0:a='255*0.70*pow(max(0\\,1-X/1180)\\,1.2)*(0.45+0.55*${dir})'[scrim]`,
    `[base][scrim]overlay=0:0[bg]`,
    `color=c=black@0:s=${W}x${H},format=rgba,${dts}[txt]`,
    `[txt]split=2[t1][t2]`,
    `[t2]colorchannelmixer=rr=0:gg=0:bb=0:aa=0.55,gblur=sigma=20[sh]`,
    `[bg][sh]overlay=0:10[bgs]`,
    `[bgs][t1]overlay=0:0[wt]`,
    `[wt]${brand},scale=1920:1080:flags=lanczos[outv]`,
  ].join(";");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-filter_complex", fc,
    "-map", "[outv]", "-frames:v", "1", "-q:v", "2", dst]);
}

// TEXTOS ---------------------------------------------------------------------
// kicker = contexto chico · l1 = linea blanca grande · l2 = el golpe (placa/color)
export const JOBS = {
  "05_tes_v3b": { kicker: "EL DE TODOS LOS DÍAS", l1: "NO LIMPIA NADA", l2: "LE HACE PIEDRAS", pos: "top" },
  "05_tes_v3": { kicker: "EL DE TODOS LOS DÍAS", l1: "NO LIMPIA NADA", l2: "LE HACE PIEDRAS", pos: "top" },
  "01_pescados": { kicker: "EL QUE COMPRA EN OFERTA", l1: "NO ES EL PESCADO", l2: "ES LA LATA", pos: "top" },
  "02_heladera": { kicker: "NEFRÓLOGO", l1: "ESTÁ EN SU HELADERA", l2: "AHORA MISMO" },
  "03_limon": { kicker: "LO TOMA TODAS LAS MAÑANAS", l1: "NO ES EL LIMÓN", l2: "ES LA HORA" },
  "04_agua": { kicker: "TODOS SE LO CREYERON", l1: "NO SON 2 LITROS", l2: "Y A LOS 60, MENOS", pos: "top" },
  "05_tes": { kicker: "EL DE TODOS LOS DÍAS", l1: "NO LIMPIA NADA", l2: "LE HACE PIEDRAS" },
  "06_analisis": { kicker: "SU ANÁLISIS", l1: "DICE “NORMAL”", l2: "Y NO LO ESTÁ" },
  "07_tobillo": { kicker: "SI LE PASA ESTO", l1: "NO ES EL CALOR", l2: "SON LOS RIÑONES", pos: "top" },
  "08_sal": { kicker: "LA QUE LE RECOMENDARON", l1: "LA SAL “LIGHT”", l2: "ES LA PEOR" },
  "09_desayuno": { kicker: "LO DESAYUNÓ HOY", l1: "SU DESAYUNO “SANO”", l2: "ES EL MÁS DAÑINO" },
};

const [cmd, arg] = process.argv.slice(2);
if (cmd === "probe") {
  const name = arg || "02_heladera";
  for (const v of ["A", "B", "C"]) {
    render(`${RAW}/${name}.png`, `${PROBE}/${name}_${v}.jpg`, v, JOBS[name]);
    console.log("✓ variante", v);
  }
} else {
  const v = (arg || "A").toUpperCase();
  for (const [name, j] of Object.entries(JOBS)) {
    if (!fs.existsSync(`${RAW}/${name}.png`)) { console.log("· falta", name); continue; }
    render(`${RAW}/${name}.png`, `${OUT}/${name}.jpg`, v, j);
    console.log("✓", name, "·", j.l1, "/", j.l2);
  }
  console.log("variante", v, "→", OUT);
}
