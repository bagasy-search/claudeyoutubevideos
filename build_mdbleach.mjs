// build_mdbleach.mjs — "Never Pour BLEACH Down THIS" (canal Mike Dalton, EN).
//
//   node build_mdbleach.mjs
//
// Lee `_v3/mdbleach_plan.json` (el DIRECTOR) y escribe:
//   src/VideoEdit/cues_mdbleach.gen.tsx · src/VideoEdit/avatar_mdbleach.gen.ts
//   _mdbleach_assets.txt
//
// `src/VideoEdit/Main_mdbleach.tsx` y `src/index_mdbleach.tsx` están escritos A MANO
// (son 35 líneas y no cambian entre corridas); este build NO los pisa.
//
// Diferencias con build_mdtank / build_mdtoilet:
//   · el plan trae un tipo de beat NUEVO: `imagen` (43 beats). Son los assets PHOTO_ONLY —
//     el i2v se descartó en el QC y sólo sobrevivió la foto. Van por `MdPhoto`, el gemelo
//     quieto de `MdClip` (mismo grade del canal, así el corte foto↔clip no se nota).
//   · `startFrom` viene en frames del i2v ORIGINAL (24 fps) y OffthreadVideo lo lee en frames
//     de la COMPOSICIÓN (30 fps) → hay que convertir ×1.25 o el clip entra 20% más temprano.
//   · las VENTANAS DEL AVATAR se derivan de la COBERTURA REAL (unión de los beats que tapan),
//     no de "cambió el tipo del beat". Un hueco de 60 ms entre dos beats dejaba el modo en
//     `hidden` sin nada debajo = 2 frames de NEGRO. Medido en este plan: 1 hueco @690.01s.
//   · GUARD de colisión: una lámina full-screen (MdGuidePage) que cae ADENTRO de un movimiento
//     le tapa 5 s a una escena premium de 45-67 s. Se corre al primer hueco libre después.
import fs from "fs";
import path from "path";

const SLUG = "mdbleach", COMP = "MdBleach";
const SRC_FPS = 24;   // los clips i2v de Mike
const FPS = 30;       // la composición

let { beats, totalMs, overlays: ovPlan = [] } = JSON.parse(
  fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8").replace(/^﻿/, ""),
);
beats.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < beats.length - 1; i++) if (beats[i].ms_out > beats[i + 1].ms_in) beats[i].ms_out = beats[i + 1].ms_in;
beats = beats.filter((b) => b.ms_out - b.ms_in >= 200);

// ── micro-huecos: los cierro ESTIRANDO el beat anterior ──────────────────────────────────────
// Si dejo el hueco, el avatar tiene que volver a `full` por 2 frames y parpadea. Cerrarlo por
// abajo es invisible (el plano de al lado dura 60 ms más). Los huecos GRANDES sí son avatar.
const MICROGAP = 400;
let cerrados = 0;
for (let i = 0; i < beats.length - 1; i++) {
  const hueco = beats[i + 1].ms_in - beats[i].ms_out;
  if (hueco > 0 && hueco <= MICROGAP) { beats[i].ms_out = beats[i + 1].ms_in; cerrados++; }
}

// ── PARPADEO DEL AVATAR ──────────────────────────────────────────────────────────────────────
// El plan deja 5 vueltas al presentador de 0,33-0,57 s en medio del b-roll. La distribución es
// bimodal y no deja lugar a dudas: 0.33 · 0.43 · 0.43 · 0.43 · 0.57 · y después SALTA a 4.6 s.
// Esas cinco no son una decisión de montaje, son restos de cómo el DIRECTOR restó intervalos:
// 13 frames de cara y de vuelta al b-roll se leen como un frame perdido, no como un corte.
// Se las come el plano de al lado (el que no se pase del final de su propio material).
const CLIP_MS = Math.round((121 / SRC_FPS) * 1000);   // los i2v duran 5,04 s
const AVBLINK = 1500;
const cabe = (b, nuevoMsOut, nuevoMsIn) => {
  if (b.tipo !== "clip") return true;                 // fotos y movimientos no tienen "final"
  const inicio = ((b.startFrom || 0) / SRC_FPS) * 1000;
  return inicio + (nuevoMsOut - nuevoMsIn) <= CLIP_MS;
};
let parpadeos = 0;
for (let i = 1; i < beats.length - 1; i++) {
  const b = beats[i], prev = beats[i - 1], next = beats[i + 1];
  if (b.tipo !== "avatar" || b.ms_out - b.ms_in >= AVBLINK) continue;
  if (prev.tipo === "avatar" || next.tipo === "avatar") continue;
  if (prev.ms_out !== b.ms_in || next.ms_in !== b.ms_out) continue;
  if (cabe(prev, b.ms_out, prev.ms_in)) prev.ms_out = b.ms_out;
  else if (cabe(next, next.ms_out, b.ms_in)) next.ms_in = b.ms_in;
  else if (next.tipo === "clip") {
    // el de al lado no llega al final de su propio material, pero SÍ puede entrar antes:
    // se le corre el `startFrom` hacia atrás lo que haga falta (nunca por debajo de 0).
    const need = Math.ceil(((b.ms_out - b.ms_in) / 1000) * SRC_FPS);
    const sf2 = Math.max(0, (next.startFrom || 0) - need);
    if ((sf2 / SRC_FPS) * 1000 + (next.ms_out - b.ms_in) > CLIP_MS) continue;
    next.startFrom = sf2; next.ms_in = b.ms_in;
  } else continue;                                     // ninguno de los dos llega: se queda
  beats.splice(i, 1); i--; parpadeos++;
}

const sec = (ms) => +(ms / 1000).toFixed(3);
const jprops = (p) => { const q = { ...(p || {}) }; delete q.theme; delete q.durationInFrames; return JSON.stringify(q); };

// ── ⛔ TODO SE ANCLA A LA REJILLA DE FRAMES ──────────────────────────────────────────────────
// El Main monta cada cue con `from={F(start)} durationInFrames={F(dur)}`, con F = round(s*30).
// Si `start` y `dur` se redondean POR SEPARADO, el fin de un plano y el arranque del siguiente
// NO se tocan: `53.94 + 0.98` termina en el frame 1647 y el que sigue (54.92) arranca en el
// 1648 → UN FRAME EN NEGRO. Con 298 cues eso fueron 28 destellos negros de 33 ms, invisibles
// para un muestreo cada 200 ms y perfectamente visibles en el video.
// La cura: emitir `start` y `dur` YA en múltiplos exactos de 1/30, calculando la duración a
// partir del FRAME FINAL (no del largo). Así F() los devuelve enteros y todo empalma.
const fr = (ms) => Math.round((ms / 1000) * FPS);   // ms → frame de la composición
const fsec = (f) => +(f / FPS).toFixed(4);          // frame → segundos que F() reconstruye exacto

// ── de dónde sale cada componente ────────────────────────────────────────────────────────────
const FROM_PEROXIDE = new Set(["ChapterTrailCard", "LightTrailCards", "BottleHero"]);
const FROM_MDTANK = new Set(["MdGuidePage", "MdQrCta"]);          // láminas + CTA con QR
const OWN_BG = new Set(["MdGuidePage", "MdQrCta"]);               // ya traen su propia cama de foto
const NEEDS_THEME = (c) => !FROM_PEROXIDE.has(c) && !FROM_MDTANK.has(c);

// ⛔ MICROCOPY EN ESPAÑOL: varios componentes del kit traen textos por defecto en español
// (nacieron en los canales ES). Si el plan no pisa esa prop, el default SE PUBLICA. Este video
// es EN INGLÉS: lo que el plan no manda, lo manda esta tabla.
const EN_FILL = {
  ChecklistReveal: { title: "Keep it from coming back", stamp: "THAT IS THE ROUTINE" },
  MythTruth: { mythLabel: "MYTH", truthLabel: "TRUTH" },
  HookCaption: { sub: "" },
};

// zonas de composición YA PROBADAS en mdmold/mdtoilet (el plan de este video no emite `zone`)
const ZONE = {
  HookCaption: "center", MythTruth: "topLeft", HighlightSweep: "top",
  BigStatReveal: "topLeft", ChecklistReveal: "left", BulletCascade: "left",
  NumberedSteps: "left", PullQuote: "center", FlowSteps: "top", VsDuel: "center",
};

// la cama de un componente sin fondo propio = la foto hero del clip más cercano del timeline
const clipBeats = beats.filter((b) => b.tipo === "clip");
const bedFor = (ms) => {
  let best = null, d = Infinity;
  for (const c of clipBeats) { const dd = Math.abs(c.ms_in - ms); if (dd < d) { d = dd; best = c.clip; } }
  return best ? `img/${best}.jpg` : null;
};

// ── SFX: biblioteca por rol del canal ────────────────────────────────────────────────────────
let SFXLIB = {};
try {
  const lib = JSON.parse(fs.readFileSync("public/sfx/lib/px_sfx_library.json", "utf8"));
  for (const it of lib.items) (SFXLIB[it.role] ||= []).push(`sfx/lib/${it.file}`);
} catch (e) { console.warn("⚠️ sin biblioteca SFX:", e.message); }
const sfxCtr = {}; const usedSfx = new Set();
const pickSfx = (role, fallback) => {
  const arr = (SFXLIB[role] && SFXLIB[role].length) ? SFXLIB[role] : (fallback && SFXLIB[fallback]) || [];
  if (!arr.length) return null;
  const i = (sfxCtr[role] = (sfxCtr[role] || 0)) % arr.length; sfxCtr[role]++;
  usedSfx.add(arr[i]); return arr[i];
};
const sfxCues = [];
const addSfx = (startSec, role, fallback, vol = 0.4, at = 0) => {
  const src = pickSfx(role, fallback); if (!src) return;
  sfxCues.push({ start: +(startSec + at).toFixed(3), src, vol });
};

// ── GUARD: lámina full-screen adentro de un MOVIMIENTO ───────────────────────────────────────
// El plan ancla los overlays por TEXTO de la locución y no mira qué hay debajo. Una MdGuidePage
// opaca dentro de MovRefill le come 5 s a un movimiento de 67 s hecho a mano.
const FULL_OV = new Set(["MdGuidePage", "MdQrCta"]);
const movRanges = beats.filter((b) => b.tipo === "movimiento").map((b) => [b.ms_in, b.ms_out]);
const movidos = [];
ovPlan = ovPlan.slice().sort((a, b) => a.ms_in - b.ms_in);
for (const o of ovPlan) {
  if (!FULL_OV.has(o.componente)) continue;
  const hit = movRanges.find(([a, b]) => o.ms_in < b && o.ms_out > a);
  if (!hit) continue;
  const dur = o.ms_out - o.ms_in;
  movidos.push(`${o.componente} ${sec(o.ms_in)}s → ${sec(hit[1])}s (caía dentro de un movimiento)`);
  o.ms_in = hit[1]; o.ms_out = hit[1] + dur;
}
// que el corrimiento no genere solapes entre overlays ni se pase del final
ovPlan.sort((a, b) => a.ms_in - b.ms_in);
for (let i = 0; i < ovPlan.length - 1; i++) {
  if (ovPlan[i].ms_out > ovPlan[i + 1].ms_in) ovPlan[i].ms_out = ovPlan[i + 1].ms_in;
}
ovPlan = ovPlan.filter((o) => o.ms_out - o.ms_in >= 800 && o.ms_in < totalMs);

const cues = [], overlays = [];
const missing = [], desbordes = [], clipsUsed = new Set(), imgsUsed = new Set();
let cutCtr = 0;
const fotoUsos = {};
const FOCUS = [[50, 46], [42, 38], [58, 52], [46, 60], [54, 40]];

for (const b of beats) {
  const fIn = fr(b.ms_in), fOut = fr(b.ms_out);
  const start = fsec(fIn), dur = fsec(fOut - fIn);
  const key = `${b.tipo}_${b.ms_in}`;
  if (b.tipo === "avatar" || fOut <= fIn) continue;

  if (b.tipo === "clip") {
    const src = `broll/${b.clip}.mp4`;
    clipsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    // ⛔ 24 fps de origen → frames de la comp (30). Sin esto el clip entra 20% antes de lo pedido.
    // (verificado con ffprobe: los 76 i2v de este video son 24/1, 121 frames, 5,0417 s)
    const sf = Math.round((b.startFrom || 0) * (FPS / SRC_FPS));
    // ⛔ pasarse del final del clip = ÚLTIMO FRAME CONGELADO en pantalla (no crashea: se ve feo)
    if (!cabe(b, b.ms_out, b.ms_in)) desbordes.push(`${b.clip} @${sec(b.ms_in)}s: entra en ${((b.startFrom || 0) / SRC_FPS).toFixed(2)}s y dura ${dur}s (el clip mide ${(CLIP_MS / 1000).toFixed(2)}s)`);
    const flash = b.flash ? " flash" : "";
    cues.push({ key, start, dur, el: `(d) => <MdClip durationInFrames={d} src="${src}" startFrom={${sf}}${flash} />` });
    if (dur > 1.0 && cutCtr++ % 4 === 0) addSfx(start, "swish", "whoosh_soft", 0.26);
  } else if (b.tipo === "imagen") {
    const src = `img/${b.imagen}.jpg`;
    imgsUsed.add(src);
    if (!fs.existsSync(`public/${src}`)) missing.push(src);
    // el mismo asset vuelve varias veces: cada uso entra por otro encuadre y no se lee repetido
    const n = (fotoUsos[b.imagen] = (fotoUsos[b.imagen] || 0)) % FOCUS.length; fotoUsos[b.imagen]++;
    const [fx, fy] = FOCUS[n];
    const flash = b.flash ? " flash" : "";
    cues.push({ key, start, dur, el: `(d) => <MdPhoto durationInFrames={d} src="${src}" focusX={${fx}} focusY={${fy}}${flash} />` });
    if (dur > 1.0 && cutCtr++ % 4 === 0) addSfx(start, "swish", "whoosh_soft", 0.26);
  } else if (b.tipo === "movimiento") {
    // cada movimiento recibe los frames REALES del beat: están hechos como fracciones de D
    cues.push({ key, start, dur, el: `(d) => <${b.componente} durationInFrames={d} />` });
    addSfx(start, "transition", "whoosh_soft", 0.3);
  } else if (b.tipo === "componente") {
    const c = b.componente;
    const props = { ...(EN_FILL[c] || {}), ...(b.props || {}) };
    const themed = NEEDS_THEME(c) ? " theme={THEME_PEROXIDE}" : "";
    const inner = `<${c} durationInFrames={d}${themed} {...(${jprops(props)} as any)} />`;
    if (OWN_BG.has(c)) {
      cues.push({ key, start, dur, el: `(d) => ${inner}` });
    } else {
      const bed = bedFor(b.ms_in);   // ⛔ cama de foto bajo TODO componente full-screen
      if (bed) { imgsUsed.add(bed); if (!fs.existsSync(`public/${bed}`)) missing.push(bed); }
      cues.push({ key, start, dur, el: `(d) => <MdBed durationInFrames={d}${bed ? ` img="${bed}"` : ""}>${inner}</MdBed>` });
    }
    for (const v of Object.values(props)) {
      if (typeof v === "string" && /^img\/.+\.(jpg|png)$/.test(v)) {
        imgsUsed.add(v); if (!fs.existsSync(`public/${v}`)) missing.push(v);
      }
    }
    addSfx(start, "card_slide", "whoosh_soft", 0.34);
    addSfx(start, "ding_soft", "sparkle", 0.36, 0.5);
  }
}

// ── VENTANAS DEL AVATAR: por COBERTURA REAL, no por tipo de beat ─────────────────────────────
// ⛔ COMPUERTA 1: el avatar es el FONDO GARANTIZADO. Sólo lo ocultan los beats que ponen algo
//    en pantalla (clip/imagen/movimiento/componente). Los OVERLAYS NO tocan estas ventanas: un
//    overlay que oculta el avatar deja NEGRO cuando debajo tampoco hay b-roll.
const HIDE = new Set(["clip", "imagen", "movimiento", "componente"]);
const tapa = beats.filter((b) => HIDE.has(b.tipo)).map((b) => [b.ms_in, b.ms_out]).sort((a, b) => a[0] - b[0]);
const merged = [];
for (const [a, b] of tapa) {
  const last = merged[merged.length - 1];
  if (last && a <= last[1]) last[1] = Math.max(last[1], b);
  else merged.push([a, b]);
}
const windows = [];
const pushWin = (frame, mode) => {
  const s = fsec(Math.max(0, frame));                  // misma rejilla de frames que los cues
  const last = windows[windows.length - 1];
  if (last && last.start === s) { last.mode = mode; return; }
  if (last && last.mode === mode) return;
  windows.push({ start: s, mode });
};
pushWin(0, "full");                                    // el avatar abre el video, lleno, frame 0
for (const [a, b] of merged) { pushWin(fr(a), "hidden"); pushWin(fr(b), "full"); }

// ── OVERLAYS (capa de ideas encima del b-roll) ───────────────────────────────────────────────
const ovComps = new Set(), ovFull = new Set();
for (const o of ovPlan) {
  const fIn = fr(o.ms_in), fOut = fr(o.ms_out);
  const start = fsec(fIn), dur = fsec(fOut - fIn);
  const c = o.componente;
  const props = { ...(EN_FILL[c] || {}), ...(o.props || {}) };
  for (const v of Object.values(props)) {
    if (typeof v === "string" && /^img\/.+\.(jpg|png)$/.test(v)) {
      imgsUsed.add(v); if (!fs.existsSync(`public/${v}`)) missing.push(v);
    }
  }
  if (FULL_OV.has(c)) {
    // la lámina trae su propia cama de foto y su propio fondo: NO va dentro de PremiumOverlay
    // (le pondría un Backdrop encima y le pasaría un `theme` que su firma no acepta).
    ovFull.add(c);
    overlays.push({ key: `ov_${o.ms_in}`, start, dur, el: `(d) => <${c} durationInFrames={d} {...(${jprops(props)} as any)} />` });
    addSfx(start, "card_slide", "whoosh_soft", 0.32);
    addSfx(start, "ding_soft", "sparkle", 0.34, 0.6);
  } else {
    ovComps.add(c);
    const zone = ZONE[c] || "topLeft";
    overlays.push({
      key: `ov_${o.ms_in}`, start, dur,
      el: `(d) => <PremiumOverlay durationInFrames={d} zone="${zone}" theme={THEME_PEROXIDE}><${c} durationInFrames={d} theme={THEME_PEROXIDE} {...(${jprops(props)} as any)} /></PremiumOverlay>`,
    });
    addSfx(start, "card_slide", "whoosh_soft", 0.3);
    addSfx(start, "ding_soft", "sparkle", 0.34, 0.6);
  }
}

const TOTAL = sec(totalMs);
const TOTAL_FRAMES = Math.ceil(TOTAL * FPS);
const cueLine = (c) => `  { key: ${JSON.stringify(c.key)}, start: ${c.start}, dur: ${c.dur}, el: ${c.el} },`;

const movs = [...new Set(beats.filter((b) => b.tipo === "movimiento").map((b) => b.componente))];
const comps = [...new Set(beats.filter((b) => b.tipo === "componente").map((b) => b.componente))];
const pxComps = comps.filter((c) => FROM_PEROXIDE.has(c));
const mdComps = [...new Set([...comps.filter((c) => FROM_MDTANK.has(c)), ...ovFull])];
const premComps = comps.filter((c) => NEEDS_THEME(c));
const needBed = comps.some((c) => !OWN_BG.has(c));
const hasFoto = beats.some((b) => b.tipo === "imagen");
const hasClip = beats.some((b) => b.tipo === "clip");

const imports = [
  `import React, { ReactNode } from "react";`,
  ...(hasFoto ? [`import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";`] : []),
  ...(hasClip ? [`import { MdClip } from "../mdtank/MdClip";`] : []),
  ...(needBed ? [`import { MdBed } from "../mdtank/MdBed";`] : []),
  ...(hasFoto ? [`import { Material } from "../${SLUG}/Stage";`] : []),
  ...mdComps.sort().map((m) => `import { ${m} } from "../mdtank/${m}";`),
  ...movs.map((m) => `import { ${m} } from "../${SLUG}/${m}";`),
  ...(pxComps.length ? [`import { ${pxComps.sort().join(", ")} } from "../peroxide/PeroxideHero";`] : []),
  ...(premComps.length || ovComps.size
    ? [`import { ${[...new Set([...premComps, ...ovComps])].sort().join(", ")}, THEME_PEROXIDE } from "./kit/premium";`]
    : []),
  ...(ovComps.size ? [`import { PremiumOverlay } from "./scenes/PremiumOverlay";`] : []),
];

const MDPHOTO = `
// ── MdPhoto ─────────────────────────────────────────────────────────────────────────────────
// Gemelo QUIETO de \`MdClip\` para los assets PHOTO_ONLY (el i2v se descartó en el QC y sólo
// sobrevivió la foto). Mismo grade del canal que MdClip — negro levantado, viraje rojo, viñeta —
// así el corte foto↔clip no se lee como un bache de calidad. La deriva la pone \`Material\`, a
// velocidad CONSTANTE (drift/240 por frame): un plano de 2 s se mueve poco, uno de 4 s el doble.
const MdPhoto: React.FC<{
  durationInFrames: number;
  src: string;
  focusX?: number;
  focusY?: number;
  flash?: boolean;
}> = ({ durationInFrames, src, focusX = 50, focusY = 46, flash = false }) => {
  const frame = useCurrentFrame();
  void durationInFrames;
  const fl = flash ? interpolate(frame, [0, 3], [0.22, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0C", overflow: "hidden" }}>
      <Material src={src} drift={0.08} focusX={focusX} focusY={focusY} />
      <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.1)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(88% 74% at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.5) 100%)" }} />
      {fl > 0 && <AbsoluteFill style={{ background: \`rgba(255,255,255,\${fl})\` }} />}
    </AbsoluteFill>
  );
};
`;

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, `// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
${imports.join("\n")}
${hasFoto ? MDPHOTO : ""}
export type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

export const CUES: Cue[] = [
${cues.map(cueLine).join("\n")}
];

export const OVERLAYS: Cue[] = [
${overlays.map(cueLine).join("\n")}
];

export const SFXCUES: { start: number; src: string; vol: number }[] = ${JSON.stringify(sfxCues)};
`);

fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, `// avatar_${SLUG}.gen.ts — GENERADO. NO editar a mano.
export type AvatarWindow = { start: number; mode: "full" | "hidden" };
export const TOTAL_${SLUG.toUpperCase()} = ${TOTAL};
export const TOTAL_FRAMES_${SLUG.toUpperCase()} = ${TOTAL_FRAMES};
export const AVATAR_WINDOWS: AvatarWindow[] = ${JSON.stringify(windows, null, 2)};
`);

// ── COMPUERTA 2: SIMULACIÓN ANTI-HUECO, FRAME A FRAME ────────────────────────────────────────
// Reproduce el `buildWindows` REAL (el mismo array `windows` que acaba de escribirse) y el mismo
// conjunto de cues, CON EL MISMO REDONDEO que hace el Main (`F = round(s*30)`).
// ⛔ Los OVERLAYS NO cuentan como contenido: si los contara, una ventana `hidden` sin b-roll
//    debajo pero con un overlay encima daría 0 huecos y MENTIRÍA.
// ⛔ Y el barrido va FRAME A FRAME (33 ms), no cada 200 ms: los huecos de este pipeline son de
//    UN frame (rounding), y un muestreo grueso los saltea enteros.
const F30 = (s) => Math.round(s * FPS);
const cubierto = new Uint8Array(TOTAL_FRAMES);
for (const c of cues) {
  const a = F30(c.start), n = Math.max(1, F30(c.dur));
  for (let f = Math.max(0, a); f < Math.min(a + n, TOTAL_FRAMES); f++) cubierto[f] = 1;
}
const winStarts = windows.map((w) => F30(w.start));
const modeAtF = (f) => { let i = 0; for (let k = 0; k < winStarts.length; k++) if (f >= winStarts[k]) i = k; return windows[i].mode; };
const huecos = [];
for (let f = 0; f < TOTAL_FRAMES; f++) if (modeAtF(f) === "hidden" && !cubierto[f]) huecos.push(f);
// ⛔ COMPUERTA 5: la comp tiene que durar por lo menos lo que el .wav
let wavMs = null;
try {
  const st = fs.statSync(`public/${SLUG}.wav`);
  const hdr = Buffer.alloc(64); const fd = fs.openSync(`public/${SLUG}.wav`, "r");
  fs.readSync(fd, hdr, 0, 64, 0); fs.closeSync(fd);
  const rate = hdr.readUInt32LE(24), byteRate = hdr.readUInt32LE(28);
  if (byteRate > 0) wavMs = Math.round(((st.size - 44) / byteRate) * 1000);
  void rate;
} catch { /* sin wav medible */ }

// ── lista de assets para el farm ─────────────────────────────────────────────────────────────
// Tres fuentes y las tres hacen falta:
//   1. los beats/overlays (arriba),
//   2. ⛔ las rutas HARDCODEADAS dentro de `src/mdbleach/Mov*.tsx` — los movimientos llaman a
//      `<GlassPlate src="broll/x.mp4">` en el JSX, no aparecen en ningún beat, y el farm tira
//      404 y MATA el chunk. (Mina ya pagada en mddrain.)
//   3. los hermanos `<name>_blur.jpg`, que algún componente pide en RUNTIME.
const hard = new Set();
for (const f of fs.readdirSync(`src/${SLUG}`).filter((x) => x.endsWith(".tsx"))) {
  const code = fs.readFileSync(path.join(`src/${SLUG}`, f), "utf8");
  // ⛔ NO sacar los comentarios con un regex de bloque: un movimiento documenta globs `img/*.jpg`
  //    en su cabecera y ese `/*` abre un falso comentario que se come el mapa de assets.
  for (const m of code.matchAll(/["'`]((?:img|broll|sfx|med|avatar_clips)\/[^"'`*]+?\.(?:mp4|jpe?g|png|webp|mp3|wav))["'`]/gi)) hard.add(m[1]);
}
const avatarAssets = [`${SLUG}_opt.mp4`, `${SLUG}.wav`];
for (const a of avatarAssets) if (!fs.existsSync(`public/${a}`)) missing.push(a);

const found = new Set([...clipsUsed, ...imgsUsed, ...hard, ...usedSfx]);
for (const rel of [...found]) {
  if (!/\.(jpe?g|png|webp)$/i.test(rel) || /_blur\.jpg$/i.test(rel)) continue;
  const b = rel.replace(/\.(jpe?g|png|webp)$/i, "_blur.jpg");
  if (fs.existsSync(path.join("public", b))) found.add(b);
}
for (const r of found) if (!fs.existsSync(path.join("public", r))) missing.push(r);

const assets = [...found, ...avatarAssets].sort();
fs.writeFileSync(`_${SLUG}_assets.txt`, assets.join("\n") + "\n");

// ── informe ──────────────────────────────────────────────────────────────────────────────────
console.log(`beats ${beats.length} · micro-huecos cerrados ${cerrados} · parpadeos de avatar absorbidos ${parpadeos}`);
console.log(`cues ${cues.length} (clip ${beats.filter((b) => b.tipo === "clip").length} · imagen ${beats.filter((b) => b.tipo === "imagen").length} · mov ${movs.length} · comp ${comps.length})`);
console.log(`overlays ${overlays.length} · sfx ${sfxCues.length} · ventanas avatar ${windows.length}`);
console.log(`movimientos: ${movs.join(", ")}`);
console.log(`overlays: ${[...new Set(ovPlan.map((o) => o.componente))].join(", ")}`);
if (movidos.length) { console.log(`⚠️  overlays corridos por colisión con un movimiento:`); movidos.forEach((m) => console.log("   " + m)); }
console.log(`clips ${clipsUsed.size} · imágenes ${imgsUsed.size} · hardcodeadas en src/${SLUG} ${hard.size} · assets ${assets.length}`);
console.log(`TOTAL ${TOTAL}s = ${TOTAL_FRAMES} frames @${FPS}fps`);
if (wavMs != null) {
  const ok = TOTAL_FRAMES / FPS >= wavMs / 1000;
  console.log(`wav ${(wavMs / 1000).toFixed(3)}s · comp ${(TOTAL_FRAMES / FPS).toFixed(3)}s → ${ok ? "OK (la comp cubre el audio)" : "⛔ LA COMP CORTA EL AUDIO"}`);
  if (!ok) process.exit(1);
}
console.log(huecos.length === 0
  ? `✅ simulación anti-hueco: 0 frames con el avatar oculto y sin contenido (barrido FRAME A FRAME de los ${TOTAL_FRAMES})`
  : `⛔ ${huecos.length} FRAMES EN NEGRO: ${huecos.slice(0, 10).map((f) => (f / FPS).toFixed(2) + "s").join(", ")}`);
if (huecos.length) process.exit(1);
if (missing.length) {
  console.log(`\n⛔ FALTAN ${missing.length} assets:`);
  [...new Set(missing)].slice(0, 12).forEach((m) => console.log("   " + m));
  process.exit(1);
}
console.log(`assets → _${SLUG}_assets.txt (${assets.length}) — al farm se le pasa @_${SLUG}_assets.txt (con arroba en el ARGUMENTO; el archivo en disco no la lleva).`);
console.log(`⚠️  NO corras \`node _v3/${SLUG}_assets.mjs\` después de esto: pisa el .txt y NO incluye ${SLUG}_opt.mp4 ni ${SLUG}.wav.`);
