// build_cmesilencio.mjs — MONTAJE del video `cmesilencio` (Claudio Mendoza Constructor).
//   "Haz una Caja de $20 que Silencia el Generador (y de Verdad Funciona)"
//
// Lee   _v3/secciones_cmesilencio_v2/S*_events.json (reanclados a la voz Fish real)
// Emite src/cmesilencio/{cues_cmesilencio.gen.tsx, Main_cmesilencio.tsx}
//     + src/index_cmesilencio.tsx + _cmesilencio_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render en los videos anteriores del canal):
//  · El AVATAR es el FONDO GARANTIZADO: base full SIEMPRE. El archivo ya está en bucle y a 30 fps.
//  · UN SOLO <Audio> con el master; el <Video> del avatar va MUTEADO.
//  · UN MOVIMIENTO = UNA <Sequence> (una por acto reinicia useCurrentFrame y salta la costura).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los overlay (ICONO/TEXTO/CTA) van ENCIMA, no ocultan la base, y su duración sale del TEXTO.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "cmesilencio", COMP = "Cmesilencio", UP = "CMESILENCIO", PRE = "cms_";
const FPS = 30;
const AVATAR_FILE = "avatar_cmesilencio.mp4";
const PLAN_DIR = "_v3/secciones_cmesilencio_v2";

// El orden en el que los MOVIMIENTOS aparecen en el video. Cada corrida de eventos ESCENA
// consecutivos es UN movimiento y se lleva el nombre siguiente de esta lista.
const MOV_NOMBRES = [
  "MovTercios",    // S2  — de dónde sale el ruido: el escape es sólo un tercio
  "MovNumeros",    // S4  — los tres números del ruido
  "MovAgujero",    // S5  — masa, toalla y el agujero (la moneda cruza los 5 actos)
  "MovDolares",    // S6  — el sellador y los tacos: 78 -> 66
  "MovEstante",    // S8  — el estante de materiales, 6 tarjetas con material real adentro
  "MovDieciocho",  // S14 — girar, el muro, la distancia: 78 -> 60
];
// (S16 el cierre NO lleva movimiento: se resuelve con las tarjetas CTA sobre el avatar.
//  S11 tiene un solo acto de 6 s: es un puente, y el filtro de abajo lo devuelve a la capa normal.)

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, entries) => {
  try {
    return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries",
      `stream=${entries}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim();
  } catch { return ""; }
};
const durDe = (rel) => {
  try {
    return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration",
      "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0;
  } catch { return 0; }
};

// ── duración total = el wav master (⛔ nunca cortar la última frase) ────────────
const WAV_FILE = fs.existsSync(path.join("public", `${SLUG}_fish.wav`)) ? `${SLUG}_fish.wav` : `${SLUG}.wav`;
const WAV_S = durDe(WAV_FILE);
const AVATAR_S = durDe(AVATAR_FILE);
if (!WAV_S) { console.error(`⛔ falta public/${WAV_FILE} (el master)`); process.exit(1); }
if (!AVATAR_S) { console.error(`⛔ falta public/${AVATAR_FILE} (avatar en bucle)`); process.exit(1); }
const TOTAL_S = WAV_S + 0.6;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const AVATAR_FRAMES = Math.max(1, Math.floor(AVATAR_S * FPS));
const f = (ms) => Math.round((ms / 1000) * FPS);

// ── entrada: los eventos de los 4 directores, en orden de sección ──────────────
const SECS = JSON.parse(fs.readFileSync("_v3/cmesilencio_secciones.json", "utf8")).map((s) => s.sec);
const EV = [];
for (const sec of SECS) {
  const cands = [`${PLAN_DIR}/${sec}_events.json`,
                 `${PLAN_DIR}/${sec.split("_")[0]}_events.json`];
  const p = cands.find((c) => fs.existsSync(c));
  if (!p) { console.error(`⛔ falta ${cands[0]}`); process.exit(1); }
  const a = JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
  for (const e of a) EV.push({ ...e, sec });
}
EV.sort((a, b) => a.ms - b.ms);
console.log(`eventos: ${EV.length} en ${SECS.length} secciones`);

// Los eventos LAMINA que apuntan a una página que EXISTE en la guía del canal. El resto son datos
// del video y van a `Ficha` (ver más abajo): no se disfrazan de página del producto.
const LAM_REAL = {
  cms_s14_lamina_tabla_calibre:      "img/cms_lam_cablefusible.jpg",
  cms_s15_lamina_doce_formas:        "img/cms_lam_7conexiones.jpg",
  cms_s15_lamina_trescientos_vatios: "img/cms_lam_60c_bajos.jpg",
  cms_s16_lamina_medidas_plano:      "img/cms_lam_corte.jpg",
};

const assets = new Set();
const faltan = [];
const existe = (rel) => fs.existsSync(path.join("public", rel));
const add = (rel) => { assets.add(rel); return rel; };
if (!existe(AVATAR_FILE)) { console.error(`⛔ falta public/${AVATAR_FILE}`); process.exit(1); }
add(AVATAR_FILE);

// ── MOVIMIENTOS: los ESCENA manuales declaran el componente de kit ─────────────
// La voz nueva ya no contiene los movimientos de gabinete cerrado del beatsheet anterior. Los
// cuatro movimientos compatibles se declaran con `mov` en el plan v2; no se infiere un componente
// por el orden de eventos, porque eso volvería a colar MovLaberinto/MovHorno por accidente.
const movs = [];
{
  for (const e of EV) {
    if (e.tipo === "ESCENA" && e.mov) {
      movs.push({ sec: e.sec, ms: e.ms, fin: e.ms + (e.dur || 0) * 1000, actos: 1, mov: e.mov });
    }
  }
  const porSec = new Map();
  for (const e of EV) {
    if (e.tipo !== "ESCENA" || e.mov) continue;
    const g = porSec.get(e.sec) || { sec: e.sec, ms: e.ms, fin: 0, actos: 0 };
    g.ms = Math.min(g.ms, e.ms);
    g.fin = Math.max(g.fin, e.ms + (e.dur || 0) * 1000);
    g.actos++;
    porSec.set(e.sec, g);
  }
  // Los grupos historicos sólo se aceptan si el plan los dejó expresamente; por seguridad, un
  // ESCENA sin `mov` de una sección nueva no se convierte en movimiento por proximidad.
  for (const g of porSec.values()) if (g.actos >= 2 && g.fin - g.ms >= 10000) movs.push(g);
  movs.sort((a, b) => a.ms - b.ms);
}
if (movs.length > MOV_NOMBRES.length && movs.some((m) => !m.mov)) {
  console.error(`⛔ ${movs.length} movimientos detectados y el plan tiene un movimiento sin nombre.`);
  process.exit(1);
}
let fallbackMov = 0;
for (const m of movs) if (!m.mov) m.mov = MOV_NOMBRES[fallbackMov++];
if (movs.some((m) => !m.mov)) { console.error("⛔ no hay nombre de componente para un movimiento"); process.exit(1); }
console.log("movimientos detectados:");
movs.forEach((m) => console.log(`   ${m.mov.padEnd(14)} ${(m.ms / 1000).toFixed(1)}s -> ${(m.fin / 1000).toFixed(1)}s  (${((m.fin - m.ms) / 1000).toFixed(1)}s, ${m.actos} actos)`));

const cues = [];
for (const m of movs) {
  const falta = !fs.existsSync(`src/${SLUG}/${m.mov}.tsx`);
  if (falta) { console.error(`⛔ falta src/${SLUG}/${m.mov}.tsx`); process.exit(1); }
  cues.push({
    key: JSON.stringify(`mv_${m.mov}`), start: f(m.ms), dur: Math.round(((m.fin - m.ms) / 1000) * FPS),
    capa: "base", el: `<${m.mov} acto={0} gFrame={_frame - ${f(m.ms)}} />`,
  });
}
const movsUsados = movs.map((m) => m.mov);

// ⛔ Un micro-momento DENTRO del tramo de un movimiento lo partiría en dos (el tileo recorta cada
// cue al arranque del siguiente). Los que pisan un movimiento se descartan de la capa base; los
// overlay no, que flotan encima sin robar tiempo.
const tramos = movs.map((m) => [m.ms, m.fin]);
const pisaMov = (ms) => tramos.some(([a, b]) => ms >= a - 200 && ms < b - 200);
const OVER = new Set(["ICONO", "TEXTO", "CTA"]);
let descartados = 0;

// ⛔ CAMA DE FOTO BAJO TODO COMPONENTE (regla 2.quater): sin ella, el margen del componente deja
// ver el fondo plano — y en el tramo del bucle eso son cientos de instantes con el avatar asomando.
// Se usa la última foto disponible antes de ese instante, que además da continuidad de lugar.
const fotosPorMs = EV
  .filter((e) => (e.tipo === "CLIP" || e.tipo === "FOTO") && e.nombre)
  .map((e) => ({ ms: e.ms, rel: `img/${SLUG}/${e.nombre}.jpg` }))
  .filter((x) => existe(x.rel))
  .sort((a, b) => a.ms - b.ms);
const camaDe = (ms) => {
  let r = null;
  for (const x of fotosPorMs) { if (x.ms > ms) break; r = x.rel; }
  return r || (fotosPorMs[0] ? fotosPorMs[0].rel : null);
};

// tiempo de lectura: piso = 2,0 s (overlay) + 0,28 s por palabra sobre 3
const pisoLectura = (txt, full) => {
  const pal = String(txt || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.round(((full ? 2.8 : 2.0) + Math.max(0, pal - 3) * 0.28) * FPS);
};

for (const e of EV) {
  if (e.tipo === "ESCENA") continue;
  const start = f(e.ms);
  const K = JSON.stringify(e.id);
  if (!OVER.has(e.tipo) && pisaMov(e.ms)) { descartados++; continue; }

  if (e.tipo === "CLIP" || e.tipo === "T2V") {
    const r = `broll/${SLUG}/${e.nombre}.mp4`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    const real = durDe(r);
    const cov = Math.max(2, Math.round(Math.min(e.dur, real - 0.1) * FPS));
    cues.push({ key: K, start, dur: cov, capa: "base", el: `<Clip src=${JSON.stringify(r)} />` });

  } else if (e.tipo === "FOTO") {
    const r = `img/${SLUG}/${e.nombre}.jpg`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    cues.push({ key: K, start, dur: Math.max(2, Math.round(e.dur * FPS)), capa: "base",
      el: `<Foto src=${JSON.stringify(r)} seed={${start}} />` });

  } else if (e.tipo === "LAMINA") {
    // ⛔ REGLA DE HONESTIDAD: `Lamina` sólo para páginas que EXISTEN de verdad en la guía. Un dato
    // del video disfrazado de página del producto rompe el embudo (el que compra no la encuentra).
    // Todo lo demás va a `Ficha`, que es visiblemente una tarjeta del video, no papel.
    const dur = Math.max(Math.round(e.dur * FPS), pisoLectura(e.texto, true));
    const r = LAM_REAL[e.nombre] || (e.nombre ? null : "img/cms_lam_corte.jpg");
    if (r) {
      if (!existe(r)) { faltan.push(r); continue; }
      add(r);
      const bed = camaDe(e.ms);
      if (bed) add(bed);
      cues.push({ key: K, start, dur, capa: "base",
        el: `<Lamina src=${JSON.stringify(r)} ${bed ? `bed=${JSON.stringify(bed)} ` : ""}` +
            `rotulo={${JSON.stringify(e.texto || "")}} />` });
    } else {
      const bed = camaDe(e.ms);
      if (bed) add(bed);
      cues.push({ key: K, start, dur, capa: "base",
        el: `<Ficha texto={${JSON.stringify(e.texto || "")}} ${bed ? `bed=${JSON.stringify(bed)}` : ""} />` });
    }

  } else if (e.tipo === "ICONO") {
    // el plan escribe el ícono unas veces con extensión y otras sin ella
    const r = `img/${SLUG}/${String(e.icono).replace(/\.png$/i, "")}.png`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    cues.push({ key: K, start, dur: Math.max(Math.round(e.dur * FPS), pisoLectura(e.texto, false)),
      capa: "over", el: `<IconoNum src=${JSON.stringify(r)} texto={${JSON.stringify(e.texto || "")}} />` });

  } else if (e.tipo === "TEXTO") {
    if (!String(e.texto || "").trim()) continue;
    cues.push({ key: K, start, dur: Math.max(Math.round(e.dur * FPS), pisoLectura(e.texto, false)),
      capa: "over", el: `<Rotulo texto={${JSON.stringify(e.texto)}} />` });

  } else if (e.tipo === "CTA") {
    const r = e.asset || (e.icono === "QR" ? "img/cms_qrcard.jpg" : "img/cms_portada.jpg");
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    cues.push({ key: K, start, dur: Math.max(Math.round(e.dur * FPS), pisoLectura(e.texto, false)),
      capa: "over", el: `<Cta src=${JSON.stringify(r)} texto={${JSON.stringify(e.texto || "")}} />` });
  }
}

if (faltan.length) {
  console.error(`⛔ ${faltan.length} assets faltan en disco (${[...new Set(faltan)].length} únicos):`);
  [...new Set(faltan)].slice(0, 25).forEach((x) => console.error("   " + x));
  if (!process.env.SIN_ASSETS) process.exit(1);
  console.error("   (SIN_ASSETS=1: sigo igual, esto es un ensayo)");
}

// ⛔⛔ COMPUERTA DE FPS — el defecto que NINGUNA otra compuerta ve. Clips a 24 y avatar a 25 en una
// comp de 30 -> Remotion repite y saltea cuadros de forma irregular: TIRÓN en todo el metraje.
{
  const malos = [];
  for (const rel of [...assets].filter((a) => a.endsWith(".mp4")).concat([AVATAR_FILE])) {
    const r = probe(rel, "r_frame_rate");
    if (r && r !== `${FPS}/1`) malos.push(`${rel} -> ${r}`);
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    process.exit(1);
  }
  console.log(`fps ✓ ${[...assets].filter((a) => a.endsWith(".mp4")).length} clips + el avatar a ${FPS}/1 CFR`);
}

// ── TILEO DE LA CAPA BASE ──────────────────────────────────────────────────────
// La apertura queda limpia para Claudio: los primeros 2 s son avatar full-frame,
// sin cama de foto ni overlay. Después empieza el relleno visual del montaje.
const LOOP_F = Math.round(2 * FPS);
const TOPE_ESTIRO = Math.round(6.5 * FPS);
let base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start || a.dur - b.dur);

// ⛔ EL PLANO APLASTADO: dos momentos a 1,5 s de distancia dejan al primero en 1,5 s. No se arregla
// estirando (el tileo recorta igual): se arregla SACANDO el que aplasta. Un MOVIMIENTO nunca se saca.
{
  const PISO = Math.round(2.4 * FPS);
  const out = [];
  let borrados = 0;
  for (const c of base) {
    const prev = out[out.length - 1];
    const esMov = /^mv_/.test(JSON.parse(c.key));
    if (prev && !esMov && c.start - prev.start < PISO) { borrados++; continue; }
    out.push(c);
  }
  console.log(`planos aplastados descartados: ${borrados} (piso ${(PISO / FPS).toFixed(1)}s entre arranques)`);
  base = out;
  const keep = new Set(base.map((c) => c.key));
  for (let i = cues.length - 1; i >= 0; i--) if (cues[i].capa === "base" && !keep.has(cues[i].key)) cues.splice(i, 1);
}

let recort = 0, recortF = 0, estir = 0, estirF = 0, micro = 0;
for (let i = 0; i < base.length; i++) {
  const sig = i + 1 < base.length ? base[i + 1].start : TOTAL_FRAMES;
  const fin = base[i].start + base[i].dur;
  if (fin > sig) { recortF += fin - sig; recort++; base[i].dur = Math.max(2, sig - base[i].start); }
  else if (fin < sig && base[i].start >= LOOP_F) {
    const h = sig - fin;
    if (h <= TOPE_ESTIRO) { estirF += h; estir++; base[i].dur = sig - base[i].start; }
  } else if (fin < sig && sig - fin <= 2) { micro++; base[i].dur = sig - base[i].start; }
}
console.log(`tileo: ${recort} recortados (-${(recortF / FPS).toFixed(1)}s de solape) · ` +
  `${estir} estirados post-bucle (+${(estirF / FPS).toFixed(1)}s) · ${micro} destellos de 1-2 frames cerrados`);

// ── RELLENO ANTI-HUECO POST-BUCLE ────────────────────────────────────────────────
// ⛔ Después del bucle el lipsync YA NO VALE: cada instante sin contenido encima es un plano del
// avatar con la boca desfasada. Y hay tramos que son casi todos OVERLAY —el cierre tiene 9 tarjetas
// de CTA y sólo 10 cues de base para 113 s— porque el QR va flotando AL LADO del avatar hablando,
// que es la regla del canal. El overlay flota, no cubre: el hueco queda igual.
// Se rellena con la FOTO más cercana de ese tramo (Ken-Burns), partiendo los huecos largos en
// varias fotos para que no quede un plano clavado de 39 s.
{
  const PISO_HUECO = Math.round(1.5 * FPS);
  const TROZO = Math.round(5.5 * FPS);
  const ocupado = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocupado[x] = 1;

  const nuevos = [];
  let ini = -1;
  for (let x = LOOP_F; x <= TOTAL_FRAMES; x++) {
    const libre = x < TOTAL_FRAMES && !ocupado[x];
    if (libre && ini < 0) ini = x;
    if ((!libre || x === TOTAL_FRAMES) && ini >= 0) {
      const largo = x - ini;
      if (largo >= PISO_HUECO) {
        const trozos = Math.max(1, Math.round(largo / TROZO));
        const paso = Math.floor(largo / trozos);
        for (let k = 0; k < trozos; k++) {
          const a = ini + k * paso;
          const d = k === trozos - 1 ? x - a : paso;
          const rel = camaDe(Math.round((a / FPS) * 1000));
          if (!rel) continue;
          add(rel);
          nuevos.push({ key: JSON.stringify(`fill_${a}`), start: a, dur: Math.max(2, d), capa: "base",
            el: `<Foto src=${JSON.stringify(rel)} seed={${a}} />` });
        }
      }
      ini = -1;
    }
  }
  if (nuevos.length) {
    cues.push(...nuevos);
    base = base.concat(nuevos).sort((a, b) => a.start - b.start);
    console.log(`relleno post-bucle: ${nuevos.length} fotos insertadas para tapar huecos donde el lipsync ya no vale`);
  }
}

// ── RÓTULOS QUE SE PISAN ───────────────────────────────────
// ⛔ El piso de TIEMPO DE LECTURA puede pasarse del slot (los overlay flotan y eso es correcto),
// pero dos rótulos seguidos terminan encabalgados en la MISMA esquina y se leen como un amasijo de
// letras. Medido en el primer render: 52 de 210. Ninguna compuerta lo ve — no crashea, no deja hueco
// y el texto es correcto; sólo se ve mirando el video.
// Un rótulo nuevo REEMPLAZA al anterior: se recorta el primero al arranque del segundo, con un piso
// de 1,2 s para que no quede un destello.
{
  const PISO = Math.round(1.2 * FPS);
  const rot = cues.filter((c) => c.capa === "over" && /<Rotulo /.test(c.el)).sort((a, b) => a.start - b.start);
  let cortados = 0;
  for (let i = 0; i < rot.length - 1; i++) {
    const sig = rot[i + 1].start;
    const fin = rot[i].start + rot[i].dur;
    if (fin > sig) {
      const nuevo = Math.max(PISO, sig - rot[i].start);
      if (nuevo < rot[i].dur) { rot[i].dur = nuevo; cortados++; }
    }
  }
  console.log(`rótulos recortados para que no se pisen: ${cortados} de ${rot.length}`);
}

// ── COBERTURA (el anti-hueco da 0 siempre porque el avatar es el piso: se mide aparte) ──
{
  const ocupado = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocupado[x] = 1;
  let cub = 0, cubPost = 0, totPost = 0;
  for (let x = 0; x < TOTAL_FRAMES; x++) {
    cub += ocupado[x];
    if (x >= LOOP_F) { totPost++; cubPost += ocupado[x]; }
  }
  const huecos = [];
  let ini = -1;
  for (let x = 0; x < TOTAL_FRAMES; x++) {
    if (!ocupado[x] && ini < 0) ini = x;
    if ((ocupado[x] || x === TOTAL_FRAMES - 1) && ini >= 0) {
      if ((x - ini) / FPS >= 4) huecos.push([ini / FPS, (x - ini) / FPS]);
      ini = -1;
    }
  }
  console.log(`cobertura: ${(100 * cub / TOTAL_FRAMES).toFixed(1)}% global · ` +
    `${(100 * cubPost / totPost).toFixed(1)}% DESPUÉS del bucle (tiene que ser ~100)`);
  console.log(`huecos >=4s: ${huecos.length}`);
  huecos.slice(0, 14).forEach(([s, d]) =>
    console.log(`   hueco ${Math.floor(s / 60)}:${(s % 60).toFixed(0).padStart(2, "0")} de ${d.toFixed(1)}s` +
      ""));
}

// ── PACING (sobre los ARRANQUES de la capa base: un overlay NO es un corte) ──
{
  const d = [];
  for (let i = 0; i < base.length - 1; i++) d.push((base[i + 1].start - base[i].start) / FPS);
  d.sort((a, b) => a - b);
  const med = d[Math.floor(d.length / 2)], p75 = d[Math.floor(d.length * 0.75)];
  const largos = 100 * d.filter((x) => x >= 5).length / d.length;
  console.log(`pacing: mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · >=5s ${largos.toFixed(1)}%`);
  if (med < 3.2 || p75 < 4.6) console.log("   ⚠️ metrónomo: la mediana y el p75 están muy juntos");
}

// ── cues_<slug>.gen.tsx ────────────────────────────────────────────────────────
const imports = movsUsados.map((m) => `import { ${m} } from "./${m}";`).join("\n");
const piezasUsadas = ["Clip", "Foto", "IconoNum", "Rotulo", "Cta", "Ficha"];
if (cues.some((c) => /<Lamina\b/.test(c.el))) piezasUsadas.splice(3, 0, "Lamina");
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { ${piezasUsadas.join(", ")} } from "./Piezas";
${imports}

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_${UP}: Cue[] = [
${cues.sort((a, b) => a.start - b.start).map((c) => {
  const param = /_frame/.test(c.el) ? "_frame: number" : "";
  return `  { key: ${c.key}, start: ${c.start}, dur: ${c.dur}, capa: ${JSON.stringify(c.capa)}, el: (${param}) => ${c.el} },`;
}).join("\n")}
];
`);

// ── Main ───────────────────────────────────────────────────────────────────────
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Loop, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { CUES_${UP} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  El archivo visual ya contiene el bucle completo y está a 30 fps.
 *  ⛔ NUNCA ESTÁTICO: el montaje le aplica un desplazamiento mínimo determinista. */
const AvatarPiso: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.035 + Math.sin(f / 900) * 0.022;
  const dx = Math.sin(f / 1300) * 0.5;
  const est: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover",
    transform: \`scale(\${s.toFixed(4)}) translateX(\${dx.toFixed(3)}%)\`,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
      <Loop durationInFrames={${AVATAR_FRAMES}}>
        <Video src={staticFile("${AVATAR_FILE}")} muted style={est} />
      </Loop>
    </AbsoluteFill>
  );
};

export const Main${COMP}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_${UP}.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_${UP}.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${WAV_FILE}")} />
    </AbsoluteFill>
  );
};
`);

// ── entry propio (SIN esto el farm usa src/index.tsx COMPARTIDO de otra sesión) ──
fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./${SLUG}/Main_${SLUG}";
const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ⛔⛔ LOS MOVIMIENTOS TIENEN SUS RUTAS HARDCODEADAS ADENTRO DEL .tsx. El escaneo de cues NO las ve,
// así que sin esto el tar sale corto y CADA chunk que monte un movimiento muere con 404 — y el error
// MIENTE ("EncodingError: source image cannot be decoded"). Hay que sacar los comentarios primero:
// un comentario que dice "nunca uses img/x.png" NO es una referencia.
let deMovs = 0;
for (const fn of fs.readdirSync(`src/${SLUG}`).filter((n) => n.endsWith(".tsx"))) {
  const crudo = fs.readFileSync(path.join("src", SLUG, fn), "utf8");
  const src = crudo
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/([^:])\/\/[^\n"'`]*$/gm, "$1 ");
  for (const m of src.matchAll(/["'`]((?:broll|img|sfx|med)\/[^"'`\s]+\.(?:mp4|png|jpg|jpeg|webm|mp3|wav))["'`]/g)) {
    const r = m[1];
    if (!existe(r)) { console.error(`⛔ ${fn}: NO EXISTE public/${r}`); if (!process.env.SIN_ASSETS) process.exit(1); continue; }
    if (!assets.has(r)) { assets.add(r); deMovs++; }
  }
  for (const m of src.matchAll(/`[^`]*(?:broll|img)\/[^`]*\$\{/g)) {
    console.error(`⛔ ${fn}: ruta por TEMPLATE LITERAL, el tar no la empaqueta: ${m[0].slice(0, 60)}`);
    process.exit(1);
  }
}
console.log(`assets extra tomados de los Mov*.tsx: ${deMovs}`);

// ── RED DE SEGURIDAD: todas las imágenes del slug viajan (pesan poco y evitan el 404) ──
// ⛔ SOLO .jpg y los PNG que de verdad necesitan alfa (iconos + QR): los PNG de las fotos pesan 10×
// y llevan el tar a donde el upload se corta y el release queda EN BORRADOR.
if (fs.existsSync(`public/img/${SLUG}`)) {
  for (const n of fs.readdirSync(`public/img/${SLUG}`)) {
    if (/_blur\.jpg$/i.test(n)) continue;
    const alfa = n.startsWith(`${PRE}ic_`) || n.startsWith(`${PRE}qr`);
    if (/\.jpg$/i.test(n) || (alfa && /\.png$/i.test(n))) assets.add(`img/${SLUG}/${n}`);
  }
}
for (const n of fs.readdirSync("public/img")) {
  if (!n.startsWith(PRE) || /_blur\.jpg$/i.test(n)) continue;
  if (/\.jpg$/i.test(n) || /^cms_(ic_|qr)/.test(n)) assets.add(`img/${n}`);
}

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ───────────
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  if (/\.(png|jpg)$/i.test(a)) {
    const b = a.replace(/\.(png|jpg)$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\` antes de farmear`);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base ${base.length} · over ${cues.length - base.length}) · ${descartados} momentos descartados por pisar un movimiento`);
console.log(`movimientos: ${movsUsados.length} · eventos: ${EV.length}`);
console.log(`assets: ${assets.size} (+blur = ${conBlur.length})`);
console.log(`duración: ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(2)}s)`);
