// build_cmesilencio.mjs — MONTAJE del video `cmesilencio` (Claudio Mendoza Constructor).
//   "Haz una Caja de $20 que Silencia el Generador (y de Verdad Funciona)"
//
// Lee   _v3/secciones_cmesilencio_v2/S*_events.json (reanclados a la voz Fish real)
// Emite src/cmesilencio/{cues_cmesilencio.gen.tsx, Main_cmesilencio.tsx}
//     + src/index_cmesilencio.tsx + _cmesilencio_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render en los videos anteriores del canal):
//  · El AVATAR es el FONDO GARANTIZADO: base full SIEMPRE. El archivo ya está en bucle y a 30 fps.
//  · UN SOLO <Audio> con el master; el <OffthreadVideo> del avatar va MUTEADO.
//  · UN MOVIMIENTO = UNA <Sequence> (una por acto reinicia useCurrentFrame y salta la costura).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los overlay (ICONO/TEXTO/CTA) van ENCIMA, no ocultan la base, y su duración sale del TEXTO.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "cmesilencio", COMP = "Cmesilencio", UP = "CMESILENCIO", PRE = "cms_";
const FPS = 30;
const AVATAR_FILE = "avatar_cmesilencio.mp4";
const PLAN_DIR = "_v3/secciones_cmesilencio_v3";

// Regla editorial vigente: un plano sólo entra si nace de un evento anclado a la voz.
// No se generan pools por sección, rellenos de huecos ni montajes largos por tema.
// Cuando un evento no tiene un recurso que muestre sus sustantivos, queda el avatar.

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
const SECTION_ROWS = JSON.parse(fs.readFileSync("_v3/cmesilencio_secciones_v3.json", "utf8"));
const SECS = SECTION_ROWS.map((s) => s.sec);
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

const cues = [];
let descartados = 0;

const visualAudit = [];
const photoForEvent = (e) => {
  const candidates = [];
  if (e.asset) candidates.push(e.asset);
  if (e.nombre) {
    candidates.push(`img/${SLUG}/${e.nombre}.jpg`);
    candidates.push(`img/${SLUG}/${e.nombre}.png`);
  }
  return candidates.find(existe) || null;
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

  if (e.tipo === "CLIP" || e.tipo === "T2V") {
    const r = `broll/${SLUG}/${e.nombre}.mp4`;
    if (!existe(r)) {
      visualAudit.push({ sec: e.sec, id: e.id, tipo: e.tipo, ms: e.ms, dur: e.dur,
        dice: e.dice || e.texto || "", asset: r, decision: "avatar: no existe recurso exacto" });
      console.warn(`visual exacto ausente: ${e.id} · queda Claudio (${r})`);
      continue;
    }
    add(r);
    const real = durDe(r);
    const cov = Math.max(2, Math.round(Math.min(e.dur, real - 0.1) * FPS));
    cues.push({ key: K, start, dur: cov, capa: "base", el: `<Clip src=${JSON.stringify(r)} />` });
    visualAudit.push({ sec: e.sec, id: e.id, tipo: e.tipo, ms: e.ms, dur: e.dur,
      dice: e.dice || e.texto || "", asset: r, decision: "plano directo anclado" });

  } else if (e.tipo === "FOTO") {
    const r = photoForEvent(e);
    if (!r) {
      visualAudit.push({ sec: e.sec, id: e.id, tipo: e.tipo, ms: e.ms, dur: e.dur,
        dice: e.dice || e.texto || "", asset: null, decision: "avatar: no existe foto exacta" });
      console.warn(`foto exacta ausente: ${e.id} · queda Claudio`);
      continue;
    }
    add(r);
    cues.push({ key: K, start, dur: Math.max(2, Math.round(e.dur * FPS)), capa: "base",
      el: `<Foto src=${JSON.stringify(r)} seed={${start}} />` });
    visualAudit.push({ sec: e.sec, id: e.id, tipo: e.tipo, ms: e.ms, dur: e.dur,
      dice: e.dice || e.texto || "", asset: r, decision: "foto directa anclada" });

  } else if (e.tipo === "LAMINA") {
    // ⛔ REGLA DE HONESTIDAD: `Lamina` sólo para páginas que EXISTEN de verdad en la guía. Un dato
    // del video disfrazado de página del producto rompe el embudo (el que compra no la encuentra).
    // Todo lo demás va a `Ficha`, que es visiblemente una tarjeta del video, no papel.
    const dur = Math.max(Math.round(e.dur * FPS), pisoLectura(e.texto, true));
    const r = LAM_REAL[e.nombre] || (e.nombre ? null : "img/cms_lam_corte.jpg");
    if (r) {
      if (!existe(r)) { faltan.push(r); continue; }
      add(r);
      cues.push({ key: K, start, dur, capa: "base",
        el: `<Lamina src=${JSON.stringify(r)} ` +
            `rotulo={${JSON.stringify(e.texto || "")}} />` });
    } else {
      cues.push({ key: K, start, dur, capa: "base",
        el: `<Ficha texto={${JSON.stringify(e.texto || "")}} />` });
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
      capa: "over", el: `<Cta src=${JSON.stringify(r)} />` });
  }
}

// Apertura anclada a las palabras “caja”, “20 dólares”, “generador” y “funciona”.
// Es un único plano diurno del patio realista de Claudio; no se recicla como relleno.
{
  const rel = "img/cmesilencio_v6/v6_opening_daylight.jpg";
  const startMs = 580;
  const endMs = 5880;
  if (existe(rel)) {
    add(rel);
    cues.push({ key: JSON.stringify("opening_exact_box_generator"), start: f(startMs),
      dur: Math.max(2, f(endMs) - f(startMs)), capa: "base",
      el: `<Foto src=${JSON.stringify(rel)} seed={${f(startMs)}} />` });
    visualAudit.push({ sec: "S1_HOOK", id: "opening_exact_box_generator", tipo: "FOTO", ms: startMs,
      dur: (endMs - startMs) / 1000, dice: "caja de 20 dólares que silencia un generador y funciona",
      asset: rel, decision: "plano directo anclado a la apertura" });
  } else {
    console.warn(`foto exacta ausente: apertura · queda Claudio (${rel})`);
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

// ── ORDEN DE LA CAPA BASE ──────────────────────────────────────────────────────
// La duración de cada plano sigue su evento de voz. No se estira para tapar huecos:
// un hueco significa que vuelve Claudio, porque no hay material exacto para esa frase.
let base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start || a.dur - b.dur);

// Dos eventos base en el mismo instante son alternativas del mismo anclaje, no dos capas.
// Conservamos el primero y evitamos que uno tape silenciosamente al otro.
{
  const out = [];
  let borrados = 0;
  for (const c of base) {
    const prev = out[out.length - 1];
    if (prev && c.start === prev.start) { borrados++; continue; }
    out.push(c);
  }
  console.log(`alternativas base en el mismo anclaje descartadas: ${borrados}`);
  base = out;
  const keep = new Set(base.map((c) => c.key));
  for (let i = cues.length - 1; i >= 0; i--) if (cues[i].capa === "base" && !keep.has(cues[i].key)) cues.splice(i, 1);
}

let recort = 0, recortF = 0;
for (let i = 0; i < base.length; i++) {
  const sig = i + 1 < base.length ? base[i + 1].start : TOTAL_FRAMES;
  const fin = base[i].start + base[i].dur;
  if (fin > sig) { recortF += fin - sig; recort++; base[i].dur = Math.max(2, sig - base[i].start); }
}
console.log(`tileo: ${recort} recortados (-${(recortF / FPS).toFixed(1)}s de solape) · ` +
  `sin estirar planos para llenar huecos`);

// Pregunta real del tramo S3: 06:42.20 en el transcript del WAV híbrido.
// Es un detalle editorial, no un subtítulo: entra como tarjeta de cuaderno y se retira antes de
// que empiece la explicación de la guía.
{
  const start = f(402200);
  const dur = Math.round(4.5 * FPS);
  cues.push({ key: JSON.stringify("manual_question_outage"), start, dur, capa: "over",
    el: `<TypewriterCard duration={${dur}} />` });
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

// ── COBERTURA ──────────────────────────────────────────────────────────────────
// La cobertura parcial es intencional: el avatar permanece debajo y ocupa exactamente los
// momentos en los que no existe un plano que muestre lo que se está diciendo.
{
  const ocupado = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocupado[x] = 1;
  let cub = 0;
  for (let x = 0; x < TOTAL_FRAMES; x++) {
    cub += ocupado[x];
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
  console.log(`cobertura: ${(100 * cub / TOTAL_FRAMES).toFixed(1)}% con plano directo · el resto queda en Claudio`);
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
const imports = "";
const piezasUsadas = ["Clip", "Foto", "IconoNum", "Rotulo", "Cta", "Ficha", "TypewriterCard"];
if (cues.some((c) => /<GuideBoard\b/.test(c.el))) piezasUsadas.push("GuideBoard");
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
import { AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
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
        <OffthreadVideo src={staticFile("${AVATAR_FILE}")} muted style={est} />
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
let deComponentes = 0;
// Sólo se escanea la pieza activa. Los montajes viejos permanecen como historial y no pueden
// volver al tar ni al render por accidente.
for (const fn of fs.readdirSync(`src/${SLUG}`).filter((n) => n === "Piezas.tsx")) {
  const crudo = fs.readFileSync(path.join("src", SLUG, fn), "utf8");
  const src = crudo
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/([^:])\/\/[^\n"'`]*$/gm, "$1 ");
  for (const m of src.matchAll(/["'`]((?:broll|img|sfx|med)\/[^"'`\s]+\.(?:mp4|png|jpg|jpeg|webm|mp3|wav))["'`]/g)) {
    const r = m[1];
    if (!existe(r)) { console.error(`⛔ ${fn}: NO EXISTE public/${r}`); if (!process.env.SIN_ASSETS) process.exit(1); continue; }
    if (r.startsWith("img/cmesilencio_v3/")) continue;
    if (!assets.has(r)) { assets.add(r); deComponentes++; }
  }
  for (const m of src.matchAll(/`[^`]*(?:broll|img)\/[^`]*\$\{/g)) {
    console.error(`⛔ ${fn}: ruta por TEMPLATE LITERAL, el tar no la empaqueta: ${m[0].slice(0, 60)}`);
    process.exit(1);
  }
}
console.log(`assets extra tomados de las piezas activas: ${deComponentes}`);

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

fs.writeFileSync(`_${SLUG}_visual_audit.json`, JSON.stringify({
  rule: "Cada plano nace de un evento anclado a la voz; sin pools ni rellenos temáticos.",
  items: visualAudit,
}, null, 2) + "\n");

if (cues.some((c) => /fill_|extra_clip_|extra_photo_|mv_/.test(c.key))) {
  console.error("⛔ apareció un cue automático o un movimiento no anclado");
  process.exit(1);
}

console.log(`cues ${cues.length} (base ${base.length} · over ${cues.length - base.length}) · ${descartados} descartados`);
console.log(`movimientos automáticos: 0 · eventos: ${EV.length}`);
console.log(`assets: ${assets.size} (+blur = ${conBlur.length})`);
console.log(`duración: ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(2)}s)`);
