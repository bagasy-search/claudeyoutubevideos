// build_clembudo.mjs — "Cobro 180 dólares por sacar una mancha que me cuesta 3"
// (El Constructor Libre, embudo del curso). Presentador: Claudio Mendoza.
//
//   node build_clembudo.mjs
//
// Lee `_v3/clembudo_plan.json` (generado por `_v3/clembudo_plan.mjs`, anclado al ms de Whisper) y
// escribe: cues_clembudo.gen.tsx · avatar_clembudo.gen.ts · Main_clembudo.tsx · index_clembudo.tsx
// · @_clembudo_assets.txt
import fs from "node:fs";

const SLUG = "clembudo", COMP = "ClEmbudo";
const { beats, totalMs } = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""));
// ⛔⛔ LOS TIEMPOS SE DERIVAN DEL FRAME FINAL, NUNCA DEL LARGO.
// Redondear `start` y `dur` POR SEPARADO deja huecos de 1 frame entre planos: el cue que va de
// 8,18 s a 11,62 s daba start=round(8.18*30)=245 y dur=round(3.44*30)=103 → tapaba hasta el frame
// 348 exclusive, pero la ventana del avatar volvía a `full` recién en round(11.62*30)=349. El
// frame 348 quedaba con el avatar oculto y NADA debajo: 33 ms de negro que `blackdetect` no ve
// (pide 0,5 s) y que un muestreo cada 200 ms se saltea. Medido por la compuerta anti-hueco.
// Con `fr()` los bordes son los MISMOS enteros para el cue y para la ventana, así que el hueco no
// puede existir — y de paso desaparecen los solapes de 1 frame.
const FPS = 30;
const fr = (ms) => Math.round((ms * FPS) / 1000);
const sec = (ms) => +(fr(ms) / FPS).toFixed(5);
const dursec = (msIn, msOut) => +(Math.max(1, fr(msOut) - fr(msIn)) / FPS).toFixed(5);

// ── CTA: las DOS ventanas del QR ─────────────────────────────────────────────────────────────
// ⛔⛔ REGLA DURA DEL CANAL: el QR va SIEMPRE como tarjeta flotando al costado con el presentador
// hablando FULL detrás. NUNCA a pantalla completa. Y en esas ventanas hay que SACAR el b-roll
// (splice de los beats) o el avatar queda tapado y el float pierde todo el sentido.
// ⛔ El CTA va en la capa `over`, JAMÁS adentro de un componente de escena: en `cmetemu` el QR
// estaba hardcodeado dentro de un Mov*, el video pasó a otro modo, los Mov* dejaron de montarse y
// el video se entregó SIN QR. Ninguna compuerta lo vio.
const QR = "img/vslcurso_qr_land.png";
const PORTADA = "img/vslcurso_portada.jpg";
const CTAS = [
  { ms: 295860, dur: 6200, kicker: "Escanea con tu celular" },   // reveal de la lámina
  { ms: 721960, dur: 9000, kicker: "Escanea con tu celular" },   // venta fuerte, única, al cierre
];

const enQR = (a, z) => CTAS.some((c) => a < c.ms + c.dur && z > c.ms);
const antes = beats.length;
let vivos = beats.filter((b) => !(b.tipo !== "avatar" && enQR(b.ms_in, b.ms_out)));
console.log(`SPLICE del CTA: ${antes - vivos.length} beats de b-roll sacados de las 2 ventanas del QR (el avatar queda FULL detrás)`);

// ── COMPONENTES DEL KIT anclados a afirmaciones REALES del guion ─────────────────────────────
// El `density_gate` medía 2-4 componentes distintos por tramo (piso 5): fuera de los movimientos
// quedaban planos seguidos sin nada del kit encima. Estos van a claims concretos, no decorativos.
// ⛔ Cada uno lleva CAMA DE FOTO debajo (regla 2.quater): los full-screen del kit dejan ~60px de
// margen y, con el avatar oculto y nada debajo, ese marco muestra el fondo plano.
const comps = JSON.parse(fs.readFileSync(`_v3/${SLUG}_comps.json`, "utf8").replace(/^﻿/, ""));
const choca = (a, z) => comps.some((c) => a < c.ms_out && z > c.ms_in);
const preComp = vivos.length;
vivos = vivos.filter((b) => !(b.tipo !== "avatar" && b.tipo !== "movimiento" && choca(b.ms_in, b.ms_out)));
vivos = vivos.concat(comps.filter((c) => !enQR(c.ms_in, c.ms_out)));
vivos.sort((a, b) => a.ms_in - b.ms_in);
console.log(`COMPONENTES: +${comps.length} anclados al ms · ${preComp - (vivos.length - comps.length)} beats de b-roll recortados por solape`);

// ── ⛔⛔ RECOMPUTAR EL AVATAR DESPUÉS DE TODO SPLICE ──────────────────────────────────────────
// El plan traía beats de avatar cubriendo los huecos, pero después le saqué b-roll (las 2 ventanas
// del QR + los solapes de los 14 componentes). Cada recorte libera tiempo que ya NO tiene beat, y
// como `windows` sólo cambia de modo cuando ARRANCA un beat, el avatar se queda en `hidden` desde
// el beat anterior: pantalla negra. Medido acá mismo: 80 instantes, 16 s de negro.
// El avatar es el FONDO GARANTIZADO, así que después de cualquier splice hay que volver a taparlo.
{
  const contenido = vivos.filter((b) => b.tipo !== "avatar").map((b) => [b.ms_in, b.ms_out]).sort((a, b) => a[0] - b[0]);
  const conAvatar = vivos.filter((b) => b.tipo !== "avatar");
  let cur = 0;
  for (const [a, z] of contenido) { if (a > cur) conAvatar.push({ tipo: "avatar", ms_in: cur, ms_out: a }); cur = Math.max(cur, z); }
  if (cur < totalMs) conAvatar.push({ tipo: "avatar", ms_in: cur, ms_out: totalMs });
  const reañadidos = conAvatar.length - vivos.length;
  vivos = conAvatar.sort((a, b) => a.ms_in - b.ms_in);
  console.log(`AVATAR recomputado tras los splices: ${vivos.filter((b) => b.tipo === "avatar").length} ventanas (${reañadidos >= 0 ? "+" : ""}${reañadidos} respecto de los beats que quedaban)`);
}

// ── cues ─────────────────────────────────────────────────────────────────────────────────────
const cues = [], overlays = [], windows = [];
const clipsUsed = new Set(), imgsUsed = new Set(), missing = [];
const note = (rel) => {
  if (!rel) return;
  if (/\.mp4$/i.test(rel)) clipsUsed.add(rel); else imgsUsed.add(rel);
  if (!fs.existsSync(`public/${rel}`)) missing.push(rel);
  const blur = rel.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
  if (blur !== rel && fs.existsSync(`public/${blur}`)) imgsUsed.add(blur);
};

let lastMode = null;
for (const b of vivos) {
  const start = sec(b.ms_in), dur = dursec(b.ms_in, b.ms_out), key = `${b.tipo}_${b.ms_in}`;
  // el avatar es el FONDO GARANTIZADO: full cuando nada lo tapa, hidden cuando algo lo cubre
  const mode = b.tipo === "avatar" ? "full" : "hidden";
  if (mode !== lastMode) { windows.push({ start, mode }); lastMode = mode; }
  if (b.tipo === "avatar") continue;

  if (b.tipo === "clip") {
    const src = `broll/${b.clip}.mp4`; note(src);
    cues.push({ key, start, dur, el: `(d) => <ClClip durationInFrames={d} src="${src}" startFrom={${b.startFrom || 0}} />` });
  } else if (b.tipo === "foto") {
    const src = `img/${b.img}.png`; note(src);
    cues.push({ key, start, dur, el: `(d) => <ClPhoto durationInFrames={d} src="${src}" seed={${b.ms_in % 100000}} />` });
  } else if (b.tipo === "movimiento") {
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} />` });
  } else if (b.tipo === "componente") {
    const props = { ...(b.props || {}) };
    // toda ruta de imagen citada por el componente entra al tarball (+ su hermano _blur.jpg, que
    // el kit deriva EN RUNTIME: ningún escaneo de props lo ve y su 404 mata el chunk igual)
    for (const v of Object.values(props)) {
      if (typeof v === "string" && /^img\/.+\.(png|jpg|jpeg)$/i.test(v)) note(v);
      else if (v && typeof v === "object" && typeof v.image === "string") note(v.image);
    }
    // ⛔⛔ LA CAMA VA COMO CAPA, NO COMO PROP. Se la pasaba como `bed` y NINGUNO de estos
    // componentes declara esa prop (BigStatReveal, MythTruth, PullQuote, ChecklistReveal y
    // HighlightSweep no la tienen): React la ignora en silencio, el componente queda flotando
    // sobre el b-roll que justo recorté para meterlo, y el cuadro sale casi negro.
    // Medido sobre el render: 6 de 183 instantes con luma <45 (mín 37), todos en estas ventanas.
    // Y `blackdetect` NO lo ve, porque no llega a ser negro: es oscuro y vacío, que es peor
    // porque pasa todas las compuertas. La cama va DEBAJO, como foto de verdad.
    let bedEl = "";
    if (b.bed) {
      const blur = b.bed.replace(/\.(png|jpg|jpeg)$/i, "_blur.jpg");
      const use = fs.existsSync(`public/${blur}`) ? blur : b.bed;
      note(use); note(b.bed);
      bedEl = `<ClPhoto durationInFrames={d} src="${b.bed}" seed={${b.ms_in % 100000}} />`;
    }
    const j = JSON.stringify(props).replace(/</g, "\\u003c");
    const comp = `<${b.componente} durationInFrames={d} theme={THEME_EARTH} {...(${j} as any)} />`;
    cues.push({ key, start, dur, el: bedEl ? `(d) => <>${bedEl}${comp}</>` : `(d) => ${comp}` });
  }
}

// ── overlays: el CTA. NO tocan `windows` (un overlay que ocultara el avatar dejaría NEGRO) ────
for (const c of CTAS) {
  note(QR); note(PORTADA);
  overlays.push({
    key: `qr_${c.ms}`, start: sec(c.ms), dur: dursec(c.ms, c.ms + c.dur),
    el: `(d) => <FloatingInsert durationInFrames={d} src="${QR}" side="right" kicker=${JSON.stringify(c.kicker)} hue="amber" />`,
  });
}

// ── ⛔⛔ EL MATERIAL HARDCODEADO DE LOS MOVIMIENTOS ───────────────────────────────────────────
// Los movimientos meten clips y fotos DENTRO de sus tarjetas de vidrio con `staticFile(...)`.
// Eso NO pasa por props, así que ningún escaneo de beats lo ve y el asset se queda fuera del
// tarball → 404 en el farm y chunk muerto. Se escanean los .tsx de `src/clembudo/`.
// ⚠️ Y NO ALCANZA CON BUSCAR `staticFile("...")` LITERAL: los movimientos arman la ruta con
// PLANTILLAS (`staticFile(\`img/clembudo/${"$"}{n}.png\`)` sobre un array de nombres). Buscar sólo el
// literal devuelve la cadena cruda `img/clembudo/${"$"}{n}.png`, que no existe en disco: la compuerta
// reporta 12 "faltantes" que son fantasmas y, peor, deja fuera los 60 archivos que SÍ se usan.
// Hay que expandir los NOMBRES que aparecen en el archivo y resolverlos contra el disco.
let hard = 0;
for (const f of fs.readdirSync(`src/${SLUG}`).filter((x) => x.endsWith(".tsx"))) {
  const src = fs.readFileSync(`src/${SLUG}/${f}`, "utf8");
  for (const m of src.matchAll(/staticFile\(\s*["`]((?:img|broll|sfx)\/[^"`$]+)["`]/g)) { note(m[1]); hard++; }
  for (const n of new Set(src.match(/clembudo_s\d+/g) || [])) {
    for (const rel of [`img/${SLUG}/${n}.png`, `broll/${SLUG}/${n}.mp4`]) if (fs.existsSync(`public/${rel}`)) { note(rel); hard++; }
  }
  for (const l of new Set(src.match(/m0\d_\d+_[a-z_]+/g) || [])) {
    const rel = `img/laminas/${l}.png`;
    if (fs.existsSync(`public/${rel}`)) { note(rel); hard++; }
  }
}
console.log(`material HARDCODEADO en los movimientos: ${hard} referencias sumadas al tarball`);

// ── ⛔⛔ COMPUERTA: UN `clip=` QUE NO EXISTE EN DISCO SE SALTEABA EN SILENCIO ──────────────────
// El escaneo de arriba suma `broll/<slug>/<n>.mp4` SÓLO SI existe. Si un movimiento pide un clip
// que no está en disco, `note()` no se llama nunca: el asset no entra al tarball, no aparece en la
// lista de faltantes, y el build termina diciendo "✅ los assets referenciados existen todos".
// Recién el farm se entera, con un 404 que mata el chunk entero 8 minutos después de arrancar.
// Medido: `clembudo_s415` está en las FOTOS del movimiento pero NO tiene clip i2v; MovCaso35 le
// pedía el .mp4 y murió el chunk 43 (frames 15.738-16.103).
// Acá se buscan los usos REALES (`clip="..."`), no las menciones en comentarios, y se exige el
// archivo. Un comentario que nombra un asset no es una referencia; un `clip=` sí.
{
  const rotos = [];
  let usos = 0;
  for (const f of fs.readdirSync(`src/${SLUG}`).filter((x) => x.endsWith(".tsx"))) {
    const src = fs.readFileSync(`src/${SLUG}/${f}`, "utf8");
    for (const m of src.matchAll(/clip=\{?\s*"([a-z0-9_]+)"/g)) {
      usos++;
      const rel = `broll/${SLUG}/${m[1]}.mp4`;
      if (!fs.existsSync(`public/${rel}`)) rotos.push(`${f} → ${rel}`);
    }
    for (const m of src.matchAll(/img=\{?\s*"([a-z0-9_]+)"/g)) {
      usos++;
      const rel = `img/${SLUG}/${m[1]}.png`;
      if (!fs.existsSync(`public/${rel}`)) rotos.push(`${f} → ${rel}`);
    }
  }
  if (rotos.length) {
    console.error(`
⛔ ${rotos.length} de ${usos} referencias de los movimientos NO existen en disco:`);
    for (const r of rotos) console.error(`   ${r}`);
    console.error("El farm las pediría igual y moriría el chunk con un 404. Arreglalas antes de rendear.");
    process.exit(1);
  }
  console.log(`compuerta de material: ${usos} usos reales (clip=/img=) de los movimientos, todos en disco`);
}

// ⚠️ la DURACIÓN total se redondea HACIA ARRIBA (no con fr(), que redondea al más cercano): el
// último frame tiene que existir aunque el audio termine a mitad de frame. Con fr() el video
// perdía 1 frame (21.934 en vez de 21.935) y la compuerta de duración lo habría acusado.
const TOTAL = sec(totalMs), TOTAL_FRAMES = Math.ceil((totalMs * FPS) / 1000);
const movs = [...new Set(vivos.filter((b) => b.tipo === "movimiento").map((b) => b.componente))];
const kit = [...new Set(vivos.filter((b) => b.tipo === "componente").map((b) => b.componente))];

// ── archivos generados ───────────────────────────────────────────────────────────────────────
const line = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;
fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { ClClip, ClPhoto } from "../${SLUG}/Piezas";
${movs.map((m) => `import { ${m} } from "../${SLUG}/${m}";`).join("\n")}
import { FloatingInsert } from "./scenes/FloatingInsert";
${kit.length ? `import { ${kit.join(", ")} } from "./kit/premium";
import { THEME_EARTH } from "./kit/premium/theme";` : ""}

export const CUES: { key: string; start: number; dur: number; el: (d: number) => React.ReactNode }[] = [
${cues.map(line).join("\n")}
];

export const OVERLAYS: { key: string; start: number; dur: number; el: (d: number) => React.ReactNode }[] = [
${overlays.map(line).join("\n")}
];

export const SFXCUES: { start: number; src: string; vol: number }[] = [];
`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
export const AVATAR_WINDOWS = ${JSON.stringify(windows)} as const;
export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};
`);

fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, `// GENERADO por build_${SLUG}.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS, SFXCUES } from "./cues_${SLUG}.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * 30);

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1C1812" }}>
    {/* el avatar es el FONDO GARANTIZADO: dura el video entero y nunca deja hueco */}
    <AvatarLayer src="${SLUG}_opt.mp4" windows={AVATAR_WINDOWS as any} accent="#7C8A5A" />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {/* el CTA va ACÁ, en la capa de overlay — nunca adentro de un componente de escena */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))}>
        {o.el(Math.max(1, F(o.dur)))}
      </Sequence>
    ))}

    {SFXCUES.map((s, i) => (
      <Sequence key={"sfx" + i} from={F(s.start)}>
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${SLUG.toUpperCase()} };
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`, `import "./index.css";
import { Composition, registerRoot } from "remotion";
import { Main${COMP}, TOTAL_FRAMES_${SLUG.toUpperCase()} } from "./VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition
    id="${COMP}"
    component={Main${COMP}}
    durationInFrames={TOTAL_FRAMES_${SLUG.toUpperCase()}}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root${COMP});
`);

// ── lista de assets del farm: rutas RELATIVAS a public/, SIN el prefijo `public/` ─────────────
const assets = [`${SLUG}_opt.mp4`, `${SLUG}.wav`, ...[...imgsUsed].sort(), ...[...clipsUsed].sort()];
fs.writeFileSync(`@_${SLUG}_assets.txt`, assets.join("\n") + "\n");

console.log(`\nbeats ${vivos.length} · cues ${cues.length} · overlays ${overlays.length} · movimientos ${movs.length}`);
console.log(`ventanas de avatar ${windows.length} · TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames`);
console.log(`assets ${assets.length}  (${imgsUsed.size} img · ${clipsUsed.size} clips)`);
console.log(missing.length ? `⛔ FALTAN ${missing.length}: ${missing.slice(0, 10).join(", ")}` : "✅ los assets referenciados existen todos");
