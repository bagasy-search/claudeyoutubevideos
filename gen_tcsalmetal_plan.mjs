// gen_tcsalmetal_plan.mjs — PLAN del video `tcsalmetal` (canal "Taller de Claudio").
// Toma el esqueleto de momentos + la dirección (un prompt por momento) y arma:
//   beats[]    → la capa base: un plano por momento, SIEMPRE metraje (clip o foto). Nunca componentes.
//   overlays[] → el sello de número de cada ítem + el CTA final. ⛔ NUNCA como cue base.
//
//   node gen_tcsalmetal_plan.mjs   → _v3/tcsalmetal_plan.json
//
// Vara del canal (feedback_edicion_vlog_casero_claudio): VLOG CRUDO, planos a sangre, cero
// componentes salvo el sello y el CTA. Un plano por FRASE, con el contexto EXACTO de esa frase.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "tcsalmetal";
const FPS = 30;
const TOTAL_MS = 1173390;
const IMGDIR = `img/${SLUG}`;
const CLIPDIR = `broll/${SLUG}`;

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const durDe = (rel) => {
  try {
    return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration",
      "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0;
  } catch { return 0; }
};
const existe = (rel) => fs.existsSync(path.join("public", rel));

const skel = JSON.parse(fs.readFileSync(`_v3/${SLUG}_skel.json`, "utf8").replace(/^\uFEFF/, ""));
const dir = JSON.parse(fs.readFileSync(`_v3/${SLUG}_dir.json`, "utf8").replace(/^\uFEFF/, ""));
const byI = new Map(dir.map((d) => [d.i, d]));

// ⛔⛔ CLIP REINVENTADO: agnes i2v a veces no "respira y parpadea" sino que REDIBUJA al presentador
//    (lo vuelve calvo, con lentes y veinte años mayor). En un canal de narrador la cara ES el
//    activo, así que esos planos vuelven a FOTO con Ken-Burns — la imagen fuente está perfecta y,
//    según la propia skill, la foto se ve MÁS fluida que el movimiento horneado.
//    La lista la produce un AUDITOR DE VISIÓN, no una métrica de píxeles: probé PSNR global contra
//    la fuente y PSNR de la banda de la cabeza (cuadro 0 vs último) y las DOS fallaron el control
//    negativo (un clip redibujado puntuaba mejor que uno sano). Medía textura, no redibujo.
const MALOS = fs.existsSync(`_v3/${SLUG}_identidad_mala.json`)
  ? new Set(JSON.parse(fs.readFileSync(`_v3/${SLUG}_identidad_mala.json`, "utf8").replace(/^﻿/, "")))
  : new Set();
if (MALOS.size) console.log(`identidad: ${MALOS.size} clips con el presentador redibujado -> vuelven a FOTO`);

// ── 1. beats: un plano por momento ──────────────────────────────────────────────────────────────
// ⛔ PASADA FINAL: cada beat se estira hasta el ms_in del SIGUIENTE → cobertura 100 % por
//    construcción, no por suerte. Sin avatar, un hueco es pantalla plana.
const beats = [];
let sinAsset = 0, nClip = 0, nSlow = 0, nFoto = 0;
for (let k = 0; k < skel.length; k++) {
  const m = skel[k];
  const d = byI.get(m.i);
  if (!d) { console.error(`⛔ el momento ${m.i} no tiene dirección`); process.exit(1); }
  const ms_in = m.ms_in;
  const ms_out = k + 1 < skel.length ? skel[k + 1].ms_in : TOTAL_MS;
  const slot = (ms_out - ms_in) / 1000;

  const relClip = `${CLIPDIR}/${d.name}.mp4`;
  const relImg = `${IMGDIR}/${d.name}.jpg`;
  const hayClip = existe(relClip) && !MALOS.has(d.name);
  const hayImg = existe(relImg);
  if (!hayClip && !hayImg) { sinAsset++; console.error(`   ⚠ sin asset: ${d.name} (i=${m.i})`); continue; }

  if (hayClip) {
    const cd = durDe(relClip) - 0.05;
    if (slot <= cd) {
      beats.push({ ms_in, ms_out, tipo: "clip", clip: d.name, i: m.i });
      nClip++;
      continue;
    }
    // ⛔ NO REPETIR IMAGEN: si sobra tiempo, el clip se ESTIRA (pedido del creador).
    // Piso 0,5x. Si ni a 0,5x alcanza, va la foto con Ken-Burns, que cubre cualquier largo
    // y se ve MÁS fluida que el movimiento horneado.
    const speed = cd / slot;
    if (speed >= 0.5) {
      beats.push({ ms_in, ms_out, tipo: "clipslow", clip: d.name, speed: +speed.toFixed(3), i: m.i });
      nSlow++;
      continue;
    }
    if (hayImg) { beats.push({ ms_in, ms_out, tipo: "imagen", imagen: d.name, i: m.i }); nFoto++; continue; }
    // sin foto: el clip a 0,5x igual, aunque congele el último tramo (mejor que pantalla plana)
    beats.push({ ms_in, ms_out, tipo: "clipslow", clip: d.name, speed: 0.5, i: m.i });
    nSlow++;
    continue;
  }
  beats.push({ ms_in, ms_out, tipo: "imagen", imagen: d.name, i: m.i });
  nFoto++;
}
if (sinAsset) { console.error(`⛔ ${sinAsset} momentos sin ningún asset en disco — el build va a abortar por cobertura`); }

// ── 2. overlays: el SELLO DE NÚMERO de cada ítem, anclado por FRASE (nunca por índice a mano) ────
const PIES = {
  "uno": "LA PARRILLA", "dos": "EL BRASERO", "tres": "LA CENIZA",
  "cuatro": "LA PUERTA", "cinco": "LA CHIMENEA", "seis": "LAS HERRAMIENTAS",
  "siete": "EL CALENTADOR", "ocho": "EL HORMIGÓN", "nueve": "LA PLANCHA", "diez": "EL AIRE",
};
const DIGITO = { uno: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5", seis: "6", siete: "7", ocho: "8", nueve: "9", diez: "10" };

const overlays = [];
// ⛔ ANCLAJE POR FRASE, NO POR PLANO: el "Número tres." puede caer a MITAD de un plano (el
//    esqueleto agrupa por duración, no por ítem). Anclar al ms_in del plano perdía 5 de 10 sellos.
//    Se busca el ms EXACTO de la palabra en _<slug>_wordms.json.
const W = JSON.parse(fs.readFileSync(`_v3/${SLUG}_wordms.json`, "utf8").replace(/^﻿/, ""));
const limpio = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
const vistos = new Set();
for (let k = 0; k + 1 < W.length; k++) {
  // ⛔ el HOOK dice "el número diez no toca ningún metal" y "el número cuatro te va a explicar":
  //    en minúscula y sin punto. El TÍTULO del ítem es "Número uno." — mayúscula y punto detrás.
  //    Sin esta distinción los sellos 4 y 10 aterrizaban en el gancho, a 88 s y 99 s.
  if (limpio(W[k].w) !== "numero" || !/^N/.test(W[k].w)) continue;
  const pal = limpio(W[k + 1].w);
  if (!/\.$/.test(W[k + 1].w)) continue;
  if (!(pal in DIGITO) || vistos.has(pal)) continue;
  vistos.add(pal);
  overlays.push({
    ms_in: W[k].ms + 250,
    ms_out: W[k].ms + 250 + 4200,     // sello corto: no tapa el b-roll
    componente: "SelloNum",
    props: { num: DIGITO[pal], pie: PIES[pal] },
  });
}
if (overlays.length !== 10) { console.error(`⛔ sellos encontrados: ${overlays.length} de 10 — ${[...vistos].join(", ")}`); process.exit(1); }

// ── 3. el CTA final, también como OVERLAY (⛔ como cue base = pantalla negra, mina de `dale1`) ──
// Este canal NO tiene landing ni infoproducto: el CTA es de canal (suscripción + el que viene).
{
  const CTA_MS = 9000;
  const ms_in = TOTAL_MS - CTA_MS - 1500;
  overlays.push({
    ms_in,
    ms_out: TOTAL_MS - 800,
    componente: "CtaFinal",
    props: { head: "LA MINI ESTUFA CON DOS LATAS", sub: "La semana que viene · suscríbete para no perdértela" },
  });
}

// ── COMPUERTA: MIN_GAP entre overlays (piso 13 s) ───────────────────────────────────────────────
overlays.sort((a, b) => a.ms_in - b.ms_in);
{
  const juntos = [];
  for (let i = 1; i < overlays.length; i++) {
    const gap = (overlays[i].ms_in - overlays[i - 1].ms_out) / 1000;
    if (gap < 13) juntos.push(`${overlays[i - 1].componente}@${overlays[i - 1].ms_in} → ${overlays[i].componente}@${overlays[i].ms_in} (gap ${gap.toFixed(1)}s)`);
  }
  if (juntos.length) { console.error(`⛔ overlays demasiado juntos (piso MIN_GAP 13 s):`); juntos.forEach((x) => console.error("   " + x)); process.exit(1); }
}

// ── COMPUERTA: ningún overlay se sale del video ─────────────────────────────────────────────────
for (const o of overlays) {
  if (o.ms_out > TOTAL_MS) { console.error(`⛔ overlay ${o.componente}@${o.ms_in} termina después del final`); process.exit(1); }
}

const plan = { totalMs: TOTAL_MS, beats, overlays };
fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));

const cob = beats.reduce((s, b) => s + (b.ms_out - b.ms_in), 0);
console.log(`beats ${beats.length} · clip ${nClip} · clipslow ${nSlow} · foto ${nFoto} (de las cuales ${MALOS.size} por identidad redibujada)`);
console.log(`overlays ${overlays.length} (${overlays.filter((o) => o.componente === "SelloNum").length} sellos + CTA)`);
console.log(`cobertura del plan ${(100 * cob / TOTAL_MS).toFixed(2)}%`);
console.log(`→ _v3/${SLUG}_plan.json`);
