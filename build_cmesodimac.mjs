// build_cmegenerador.mjs — MONTAJE del video `cmegenerador` (Claudio Mendoza Constructor).
//   "Los Generadores para Toda la Casa son Carísimos. Haz Esto en su Lugar"
//
// Lee   _v3/cmesodimac_moments_ms.json  (micro-momentos YA anclados al ms por _v3/cmes_anclar.py)
//     + _v3/cmesodimac_movs_anclado.json        (los 16 movimientos: anchor, actos y assets)
// Emite src/cmegenerador/{cues_cmegenerador.gen.tsx, Main_cmegenerador.tsx}
//     + src/index_cmegenerador.tsx + _cmegenerador_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render en los videos anteriores del canal):
//  · El AVATAR es el FONDO GARANTIZADO: base full SIEMPRE, y cada contenido cubre sólo su cobertura
//    real. Así nunca se ve fondo muerto (regla anti-hueco del pipeline).
//  · El avatar es PARCIAL (818,96 s de un video de ~25 min) -> va EN BUCLE desde LOOP_START. Después
//    de AVATAR_END el lipsync ya no vale: ahí el avatar es piso, nunca plano.
//  · El audio es UN SOLO <Audio> con el master completo y el <Video> del avatar va MUTEADO.
//  · El build NO re-ancla: consume los ms ya verificados (si re-anclara, los anchors ambiguos
//    mandarían un relleno 280 s antes, que ya pasó).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los ICONO van ENCIMA y NO ocultan la capa de abajo. Su duración sale del TEXTO, no del slot.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "cmesodimac", COMP = "Cmesodimac", UP = "CMESODIMAC";
const FPS = 30;
const AVATAR_S = 761.133;
const AVATAR_END_MS = 761133;
const LOOP_GAP_MS = 350;             // aire antes de que el mp4 vuelva a 0
const LOOP_START_MS = AVATAR_END_MS + LOOP_GAP_MS;

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
const WAV_S = durDe(`${SLUG}.wav`);
if (!WAV_S) { console.error(`⛔ falta public/${SLUG}.wav (el master)`); process.exit(1); }
const TOTAL_S = WAV_S + 0.6;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const f = (ms) => Math.round((ms / 1000) * FPS);

// ── entrada ────────────────────────────────────────────────────────────────────
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
const MM = rd("_v3/cmesodimac_moments_ms.json");
const MOVS = rd("_v3/cmesodimac_movs_anclado.json");

const assets = new Set();
const faltan = [];
const existe = (rel) => fs.existsSync(path.join("public", rel));
const add = (rel) => { assets.add(rel); return rel; };

// ── los MOVIMIENTOS: UNA sola Sequence por movimiento, NO una por acto ─────────
// ⛔ Montar una <Sequence> por ACTO reinicia `useCurrentFrame()` en cada frontera, y con eso
// saltan el polvo de la atmósfera, la deriva de las tarjetas y el barrido especular — justo en
// la costura, que es lo único que este video no puede permitirse. Con una sola Sequence por
// movimiento el reloj interno corre continuo y `gFrame` coincide con el frame local.
// Los movimientos reciben `acto={0}` = "dibujá el movimiento entero": los dos que gatean por
// acto (MovPapel, MovEscalones) lo deducen de gFrame.
const actos = [];
for (const [k, v] of Object.entries(MOVS)) {
  if (k.startsWith("_")) continue;                 // `_meta` no es un movimiento
  const base = v.ms0;                              // ms REAL del anchor (ya anclado por _v3/cmes_anclar.py)
  actos.push({
    id: `mv_${k}`, mov: k, acto: 0,                // ⛔ la clave YA es "MovCaja": no anteponer "Mov"
    ms: base, dur: v.dur, ms0: base,               // `dur` viene en SEGUNDOS del plan
  });
  // Los assets del movimiento viajan SIEMPRE (los .tsx los referencian por literal, pero
  // igual se listan acá para que el pre-vuelo falle temprano si falta alguno).
  // ⛔ De cada asset existe la FOTO (siempre: es el primer cuadro del i2v) y, sólo si es de
  // tipo clip, además el MP4. Exigir los dos daba 78 faltantes falsos.
  for (const as of v.assets) {
    const foto = `img/${SLUG}/cmes_mv_${as.n}.jpg`;
    const clip = `broll/${SLUG}/cmes_mv_${as.n}.mp4`;
    const hayF = existe(foto), hayC = existe(clip);
    if (hayF) add(foto);
    if (hayC) add(clip);
    if (!hayF && !hayC) faltan.push(`${foto}  |  ${clip}`);
    if (as.t === "clip" && !hayC) faltan.push(clip);
  }
  for (const lam of (v.laminas || [])) {
    const nombre = Array.isArray(lam) ? lam[0] : lam;
    const p = `img/${SLUG}/${nombre}.jpg`;          // las láminas del canal son JPG, no PNG
    if (!existe(p)) faltan.push(p); else add(p);
  }
  if (v.qr) { if (!existe(v.qr)) faltan.push(v.qr); else add(v.qr.replace(/^public\//, "")); }
}

// ── cues ───────────────────────────────────────────────────────────────────────
const cues = [];
for (const a of actos) {
  cues.push({ key: JSON.stringify(a.id), start: f(a.ms), dur: Math.round(a.dur * FPS), capa: "base",
    el: `<${a.mov} acto={${a.acto}} gFrame={frame - ${f(a.ms0)}} />` });
}
const movsUsados = [...new Set(actos.map((a) => a.mov))].sort();

// ⛔ Un micro-momento que caiga DENTRO del tramo de un movimiento lo partiría en dos: el tileo
// recorta cada cue al arranque del siguiente, así que un plano de 4 s clavado en el medio dejaría
// al movimiento de 60 s en 12. Los momentos que pisan un movimiento se DESCARTAN de la capa base
// (los ICONO no, que son overlay y flotan encima sin robar tiempo).
const tramos = actos.map((a) => [a.ms, a.ms + a.dur * 1000]);
const pisaMov = (ms) => tramos.some(([a, b]) => ms >= a - 200 && ms < b - 200);
let descartados = 0;

for (const e of MM.momentos) {
  const start = f(e.ms);
  const K = JSON.stringify(e.id);
  if (e.tipo !== "ICONO" && pisaMov(e.ms)) { descartados++; continue; }
  if (e.tipo === "CLIP") {
    const r = `broll/${SLUG}/${e.nombre}.mp4`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    // cov = lo que el clip REALMENTE cubre; nunca estirarlo más allá de su duración real
    const real = durDe(r);
    const cov = Math.max(2, Math.round(Math.min(e.dur, real - 0.1) * FPS));
    cues.push({ key: K, start, dur: cov, capa: "base", el: `<Clip src=${JSON.stringify(r)} />` });
  } else if (e.tipo === "FOTO") {
    const r = `img/${SLUG}/${e.nombre}.jpg`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    cues.push({ key: K, start, dur: Math.max(2, Math.round(e.dur * FPS)), capa: "base",
      el: `<Foto src=${JSON.stringify(r)} seed={${start}} />` });
  } else if (e.tipo === "ICONO") {
    const r = `img/${SLUG}/${e.icono}.png`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    // ⛔ TIEMPO DE LECTURA: el piso sale del TEXTO, no del slot. 2,0 s + 0,28 s por palabra
    // arriba de 3. Los overlay FLOTAN: pueden pasarse del slot sin robarle tiempo a nadie.
    const pal = String(e.texto || "").trim().split(/\s+/).filter(Boolean).length;
    const piso = Math.round((2.0 + Math.max(0, pal - 3) * 0.28) * FPS);
    cues.push({ key: K, start, dur: Math.max(Math.round(e.dur * FPS), piso), capa: "over",
      el: `<IconoNum src=${JSON.stringify(r)} texto={${JSON.stringify(e.texto || "")}} />` });
  }
}

if (faltan.length) {
  console.error(`⛔ ${faltan.length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 25).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ⛔⛔ COMPUERTA DE FPS — el defecto que NINGUNA otra compuerta ve (ni blackdetect, ni tsc, ni el
// auditor de visión, ni density_gate). Los clips a 24 y el avatar a 25 en una comp de 30 hacen que
// Remotion repita y saltee cuadros de forma IRREGULAR: TIRÓN en todo el metraje. Sólo se ve
// reproduciendo, y ya costó un video entero re-rendeado.
{
  const malos = [];
  for (const rel of [...assets].filter((a) => a.endsWith(".mp4")).concat([`${SLUG}_opt.mp4`])) {
    const r = probe(rel, "r_frame_rate");
    if (r !== `${FPS}/1`) malos.push(`${rel} -> ${r || "?"}`);
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    console.error("   Conformalos: minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1");
    process.exit(1);
  }
  console.log(`fps ✓ ${[...assets].filter((a) => a.endsWith(".mp4")).length} clips + el avatar a ${FPS}/1 CFR`);
}

// ── TILEO DE LA CAPA BASE ──────────────────────────────────────────────────────
//  1. RECORTAR al siguiente: un cue no puede seguir vivo después de que arranca el que sigue.
//  2. ESTIRAR para tapar huecos DESPUÉS del bucle: ahí el lipsync ya no coincide, así que cada
//     hueco es un instante con la boca desfasada. Antes del bucle el hueco está BIEN.
//  3. Cerrar los huecos de 1-2 frames: `start` y `dur` se redondean por separado, así que dos cues
//     que deberían ser contiguos dejan 33 ms de fondo asomando. `blackdetect` NO lo ve.
const LOOP_F = f(AVATAR_END_MS);
const TOPE_ESTIRO = Math.round(6.5 * FPS);   // ⛔ 11 s maquillaba la cobertura (93% falso vs 81% real)
let base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start || a.dur - b.dur);

// ⛔ EL PLANO APLASTADO: dos momentos anclados a 1,5 s de distancia dejan al primero en 1,5 s, y con
// 18 de esos el % de planos >=5 s se cae aunque la mediana esté bien. No se arregla estirando (el
// tileo recorta igual): se arregla SACANDO el momento que aplasta. El anterior se estira solo hasta
// el siguiente, así que la cobertura no baja — sube la duración de los dos lados.
// ⛔ Un MOVIMIENTO nunca se descarta: manda él.
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

// ── COBERTURA (el anti-hueco da 0 siempre porque el avatar es el piso: hay que medir aparte) ──
{
  const ocupado = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocupado[x] = 1;
  let cub = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cub += ocupado[x];
  const huecos = [];
  let ini = -1;
  for (let x = 0; x < TOTAL_FRAMES; x++) {
    if (!ocupado[x] && ini < 0) ini = x;
    if ((ocupado[x] || x === TOTAL_FRAMES - 1) && ini >= 0) {
      if ((x - ini) / FPS >= 6) huecos.push([ini / FPS, (x - ini) / FPS]);
      ini = -1;
    }
  }
  console.log(`cobertura: ${(100 * cub / TOTAL_FRAMES).toFixed(1)}%  ·  huecos >=6s: ${huecos.length}`);
  huecos.slice(0, 12).forEach(([s, d]) => console.log(`   hueco ${Math.floor(s / 60)}:${(s % 60).toFixed(0).padStart(2, "0")} de ${d.toFixed(1)}s`));
}

// ── PACING (sobre los ARRANQUES de cue de la capa base: un overlay NO es un corte) ──
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
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, IconoNum } from "./Piezas";
${imports}

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_${UP}: Cue[] = [
${cues.sort((a, b) => a.start - b.start).map((c) =>
  `  { key: ${c.key}, start: ${c.start}, dur: ${c.dur}, capa: ${JSON.stringify(c.capa)}, el: (frame: number) => ${c.el} },`).join("\n")}
];
`);

// ── Main ───────────────────────────────────────────────────────────────────────
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { CUES_${UP} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const AVATAR_FRAMES = ${Math.round(AVATAR_S * FPS)};
const LOOP_START = ${f(LOOP_START_MS)};

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo.
 *  ⛔ NUNCA ESTÁTICO: un avatar full quieto se lee como una videollamada. Lleva un push lento
 *  y cíclico (período 30 s) que nunca recorta al sujeto y que hace que los tramos en los que se
 *  lo ve solo —el hook de los primeros 14 s, el escudo de honestidad, la confesión— respiren. */
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
      <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
        <Video src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
      <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_${UP} - LOOP_START}>
        <Video src={staticFile("${SLUG}_opt.mp4")} muted style={est} />
      </Sequence>
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
      <Audio src={staticFile("${SLUG}.wav")} />
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
// MIENTE: Chrome dice "EncodingError: The source image cannot be decoded". La pista buena es la
// línea de al lado: "Error loading image with src:".
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
    if (!existe(r)) { console.error(`⛔ ${fn}: NO EXISTE public/${r}`); process.exit(1); }
    if (!assets.has(r)) { assets.add(r); deMovs++; }
  }
  for (const m of src.matchAll(/`[^`]*(?:broll|img)\/[^`]*\$\{/g)) {
    console.error(`⛔ ${fn}: ruta por TEMPLATE LITERAL, el tar no la empaqueta: ${m[0].slice(0, 60)}`);
    process.exit(1);
  }
}
console.log(`assets extra tomados de los Mov*.tsx: ${deMovs}`);

// ── RED DE SEGURIDAD: todas las imágenes del slug viajan (pesan poco y evitan el 404) ──
// ⛔ SOLO los .jpg y los PNG que de verdad necesitan alfa (iconos + QR): los PNG originales de las
// fotos pesan 1 GB y ya no los referencia nadie. Meterlos en el tar lo llevaba a ~1,5 GB, que es
// donde el upload se corta y el release queda EN BORRADOR (invisible para el runner).
for (const n of fs.readdirSync(`public/img/${SLUG}`)) {
  if (/_blur\.jpg$/i.test(n)) continue;
  const alfa = n.startsWith("cmes_ic_") || n.startsWith("cmes_qr");
  if (/\.jpg$/i.test(n) || (alfa && /\.png$/i.test(n))) assets.add(`img/${SLUG}/${n}`);
}

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ───────────
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  // Los ICONOS y el QR son PNG con alfa que se dibujan ENCIMA (IconPng / la tarjeta del QR):
  // nunca son cama de fondo, asi que no llevan _blur y pedirselo daba 50 avisos falsos.
  const overlayPng = /_ic_|_qr/.test(a);
  if (/\.(png|jpg)$/i.test(a) && !overlayPng) {
    const b = a.replace(/\.(png|jpg)$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\` antes de farmear`);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base ${base.length} · over ${cues.length - base.length}) · ${descartados} momentos descartados por pisar un movimiento`);
console.log(`movimientos: ${movsUsados.length} · momentos: ${MM.momentos.length}`);
console.log(`assets: ${assets.size} (+blur = ${conBlur.length})`);
console.log(`duración: ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(2)}s)`);
