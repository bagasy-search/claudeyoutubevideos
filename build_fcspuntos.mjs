// build_fcspuntos.mjs — clon de la cadena fcsmanos10. Lee _v3/fcspuntos_plan.json y emite
//   src/_fed6/VideoEdit/Main_fcspuntos.tsx      (build real, con `startSec:` por cue → lo mide el gate)
//   src/_fed6/VideoEdit/avatar_fcspuntos.gen.ts (ventanas de avatar → tiempo VISIBLE del gate)
//   src/index_fcspuntos.tsx
// Compuertas locales: assets presentes · cobertura 100% · abre con avatar · fps 30 · 16:9.
// ⛔ NO emite cues_*.gen.tsx ni *_beats.ts: scripts/density_gate.mjs mide el JSX del Main.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "fcspuntos", COMP = "Fcspuntos", UP = "FCSPUNTOS", FPS = 30;
const WAV_FILE = `${SLUG}.m4a`;
const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, e) => { try { return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries", `stream=${e}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim(); } catch { return ""; } };
const durDe = (rel) => { try { return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0; } catch { return 0; } };
const existe = (rel) => fs.existsSync(path.join("public", rel));
if (!existe(WAV_FILE)) { console.error(`⛔ falta public/${WAV_FILE}`); process.exit(1); }

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, "utf8"));
const beats = plan.beats.slice().sort((a, b) => a.ms_in - b.ms_in);
const overlays = (plan.overlays || []).slice().sort((a, b) => a.ms_in - b.ms_in);
const WAV_S = durDe(WAV_FILE);
const TOTAL_S = Math.max(plan.totalMs / 1000, WAV_S + 0.5);
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const F = (s) => Math.round(s * FPS);

// El PiP de FedWhiteboard (src/fcspuntos/WhiteboardScene.tsx) no vive en el plan: se suma a mano.
const assets = new Set([WAV_FILE, "broll/fcspuntos_av/pip-wb.mp4"]);
const faltan = [];
const scan = (v) => {
  if (typeof v === "string") { if (/^img\/.+\.(png|jpe?g)$/i.test(v) || /^broll\/.+\.mp4$/i.test(v)) { if (existe(v)) assets.add(v); else faltan.push(v); } return; }
  if (Array.isArray(v)) return v.forEach(scan);
  if (v && typeof v === "object") Object.values(v).forEach(scan);
};

const rows = beats.map((b) => ({ ...b, f0: F(b.ms_in / 1000), f1: F(b.ms_out / 1000) }));
rows[0].f0 = 0;
for (let i = 0; i < rows.length; i++) {
  const sig = i + 1 < rows.length ? rows[i + 1].f0 : TOTAL_FRAMES;
  rows[i].f1 = sig;
  if (rows[i].f1 <= rows[i].f0) rows[i].f1 = rows[i].f0 + 1;
}

// El relleno de huecos no puede estirar una ventana de avatar más allá de su mp4:
// en vez de alargar el avatar, adelantamos el arranque del beat siguiente.
const _durCache = new Map();
const durCached = (rel) => { if (!_durCache.has(rel)) _durCache.set(rel, durDe(rel)); return _durCache.get(rel); };
// Vale igual para los clips de agnes: agnes_qc bloquea cualquier plano más largo que su mp4
// (tolerancia 2 cuadros). El sobrante se lo queda el beat siguiente, que arranca antes.
for (let i = 0; i + 1 < rows.length; i++) {
  // `under` = el clip que va DEBAJO de un componente-overlay (ver OVERLAY_COMPONENTES).
  // Cuenta igual que un clip propio: el plano no puede durar más que su mp4.
  const fuente = rows[i].tipo === "avatar" ? rows[i].clip : rows[i].tipo === "clip" ? rows[i].src : rows[i].under || null;
  if (!fuente) continue;
  const cd = durCached(fuente);
  if (!cd) continue;
  const maxF1 = rows[i].f0 + Math.floor(cd * FPS);
  if (rows[i].f1 > maxF1 && maxF1 > rows[i].f0 + 1) { rows[i].f1 = maxF1; rows[i + 1].f0 = maxF1; }
}

// ── Componentes del kit que son OVERLAY PURO: no se pintan fondo (su `Stage` es
//    transparente) y esperan `SurfaceCtx="footage"` para sacar tinta clara. Si
//    se emiten como cue suelta quedan segundos de PANTALLA NEGRA con el texto
//    en tinta oscura, invisible. Van SIEMPRE dentro de <PremiumOverlay> y sobre
//    un clip real, que el plan declara en `under`. Ver _BUGS_fed6_integracion.md #6.
const OVERLAY_COMPONENTES = new Set(["LowerThirdId"]);

// ── LA CAMA (`props.bed`) — mecanismo del molde `fcsmanos10` (53/53 con cama → 0 negros).
// En el kit _fed6 `Panel`/`Cinema` NO pintan placa opaca: tratan el FOOTAGE. Un componente
// sin nada debajo trata el vacío y da negro, y el fade de `useBeat` (op=0 en el frame 0) lo
// vuelve negro PURO. Medido: fcsunaclavada entregado = 57 tramos, fcspuntos = 119, TODOS en
// el arranque de un cue de componente. Ver _BUGS_fed6_integracion.md #6-bis.
// ⛔ FALLO DURO, no advertencia: `build_fcsmanos10.mjs:66` sólo imprimía "⚠️ componente sin
//    cama" y seguía, y eso es exactamente lo que dejó salir los dos videos defectuosos.
const sinCama = [];
// ÚNICA excepción legítima: FedWhiteboard pinta su propia placa opaca (medido YAVG 204/211),
// así que no necesita cama. Va NOMBRADO, no como un agujero genérico "si no tiene props".
const SIN_CAMA_OK = new Set(["FedWhiteboard"]);
const exigirCama = (b, start) => {
  if (SIN_CAMA_OK.has(b.componente)) return;
  if (!b.props?.bed) { sinCama.push(`${b.componente} @${start}s`); return; }
  if (!existe(b.props.bed)) { sinCama.push(`${b.componente} @${start}s (falta el archivo ${b.props.bed})`); }
};
const cama = (b) => (b.props?.bed ? `<PhotoBed src={${JSON.stringify(b.props.bed)}} />` : "");

// props que son rutas de imagen → staticFile(...) en el JSX emitido
// `bed` NO va acá: lo emite <PhotoBed>, que ya hace su propio staticFile.
const IMG_PROPS = new Set(["image", "beforeImage", "afterImage"]);
const emitProps = (p) => Object.entries(p || {}).filter(([k]) => k !== "bed").map(([k, v]) => {
  if (IMG_PROPS.has(k) && typeof v === "string") return `${k}={staticFile(${JSON.stringify(v)})}`;
  return `${k}={${JSON.stringify(v)} as any}`;
}).join(" ");

let avLargos = 0;
const cues = [];
for (const b of rows) {
  const start = +(b.f0 / FPS).toFixed(3), dur = +((b.f1 - b.f0) / FPS).toFixed(3);
  const key = `${b.tipo}_${b.f0}`;
  if (b.tipo === "avatar") {
    if (!b.clip) { console.error(`⛔ avatar sin clip @${start}s`); process.exit(1); }
    scan(b.clip);
    const cd = durDe(b.clip);
    if (cd && dur > cd + 0.25) { avLargos++; console.error(`   avatar ${b.clip} pide ${dur.toFixed(2)}s y da ${cd.toFixed(2)}s`); }
    cues.push({ key, start, dur, el: `<AvatarWindow src={${JSON.stringify(b.clip)}} seed={${b.f0}} />` });
  } else if (b.tipo === "clip") {
    scan(b.src);
    const frames = Math.floor(durDe(b.src) * FPS) - 1;
    if (frames < 15) { console.error(`⛔ clip ${b.src} con ${frames} cuadros`); process.exit(1); }
    cues.push({ key, start, dur, el: `<ReframedVideo src={${JSON.stringify(b.src)}} seed={${b.f0}} frames={${frames}} />` });
  } else if (b.tipo === "imagen") {
    scan(b.src);
    cues.push({ key, start, dur, el: `<PhotoScene src={${JSON.stringify(b.src)}} seed={${b.f0}} />` });
  } else if (b.tipo === "componente" && b.componente === "FedWhiteboard") {
    cues.push({ key, start, dur, el: `<FedWhiteboard scene={SCENE_PUNTOS_MEC} />` });
  } else if (b.tipo === "componente" && OVERLAY_COMPONENTES.has(b.componente)) {
    if (!b.under) { console.error(`⛔ ${b.componente} @${start}s sin "under": un componente-overlay necesita un clip debajo`); process.exit(1); }
    exigirCama(b, start);
    scan(b.props); scan(b.under);
    const ud = durDe(b.under);
    const uf = Math.floor(ud * FPS) - 1;
    if (uf < 15) { console.error(`⛔ under ${b.under} con ${uf} cuadros`); process.exit(1); }
    if (dur > ud + 0.02) { console.error(`⛔ ${b.componente} @${start}s pide ${dur.toFixed(2)}s y su under ${b.under} da ${ud.toFixed(2)}s`); process.exit(1); }
    cues.push({ key, start, dur, el:
      `<>${cama(b)}<ReframedVideo src={${JSON.stringify(b.under)}} seed={${b.f0}} frames={${uf}} />`
      + `<PremiumOverlay durationInFrames={d} theme={THEME_MEDICO} zone={"left"} blur={12} grade={0.6}>`
      + `<${b.componente} durationInFrames={d} theme={THEME_MEDICO} ${emitProps(b.props)} />`
      + `</PremiumOverlay></>` });
  } else if (b.tipo === "componente") {
    exigirCama(b, start);
    scan(b.props);
    cues.push({ key, start, dur, el: `<>${cama(b)}<${b.componente} durationInFrames={d} theme={THEME_MEDICO} ${emitProps(b.props)} /></>` });
  }
}
const ov = overlays.map((o) => {
  scan(o.props);
  const f0 = F(o.ms_in / 1000); let f1 = F(o.ms_out / 1000); if (f1 <= f0) f1 = f0 + F(2);
  return { key: `ov_${f0}`, start: +(f0 / FPS).toFixed(3), dur: +((f1 - f0) / FPS).toFixed(3), el: `<RayCta durationInFrames={d} {...(${JSON.stringify(o.props)} as any)} />` };
});

if (sinCama.length) {
  console.error(`⛔ ${sinCama.length} cues de componente SIN CAMA (props.bed). Cada uno es un tramo negro en el mp4:`);
  sinCama.slice(0, 12).forEach((x) => console.error("   " + x));
  console.error("   → corré: node scripts/gen_beds.mjs fcspuntos");
  process.exit(1);
}
if (faltan.length) { console.error(`⛔ ${new Set(faltan).size} assets faltan. Primeros:`); [...new Set(faltan)].slice(0, 12).forEach((x) => console.error("   " + x)); process.exit(1); }
if (avLargos) { console.error(`⛔ ${avLargos} ventanas de avatar duran más que su clip`); process.exit(1); }

{ // cobertura + apertura
  const cov = new Uint8Array(TOTAL_FRAMES);
  for (const r of rows) for (let x = r.f0; x < Math.min(TOTAL_FRAMES, r.f1); x++) cov[x] = 1;
  const sin = cov.length - cov.reduce((a, b) => a + b, 0);
  if (sin > 0) { console.error(`⛔ ${sin} frames sin plano`); process.exit(1); }
  if (rows[0].tipo !== "avatar") { console.error("⛔ no abre con avatar"); process.exit(1); }
  if (rows[0].f1 < F(3)) { console.error("⛔ apertura de avatar < 3s"); process.exit(1); }
  console.log(`cobertura ✓ ${TOTAL_FRAMES} frames`);
}
{ // pacing
  const d = rows.map((r) => (r.f1 - r.f0) / FPS).sort((a, b) => a - b);
  const q = (p) => d[Math.floor(d.length * p)];
  console.log(`pacing · mediana ${q(0.5).toFixed(2)}s · p75 ${q(0.75).toFixed(2)}s · máx ${d[d.length - 1].toFixed(1)}s`);
}
{ // fps / aspecto
  const vids = [...assets].filter((a) => a.endsWith(".mp4"));
  const malos = vids.filter((v) => probe(v, "r_frame_rate") !== "30/1");
  if (malos.length) { console.error(`⛔ ${malos.length} videos no están a 30/1`); malos.slice(0, 6).forEach((x) => console.error("   " + x + " " + probe(x, "r_frame_rate"))); process.exit(1); }
  const imgs = [...assets].filter((a) => /\.(png|jpe?g)$/i.test(a) && !/_qrcard\.png$/.test(a));
  const malas = imgs.filter((r) => { const [w, h] = probe(r, "width,height").split(",").map(Number); return w && h && Math.abs(w / h - 16 / 9) > 0.06; });
  if (malas.length) { console.error(`⛔ ${malas.length} imágenes no son 16:9`); malas.slice(0, 6).forEach((x) => console.error("   " + x)); process.exit(1); }
  console.log(`fps ✓ ${vids.length} videos · aspecto ✓ ${imgs.length} imágenes`);
}

// ── avatar_<slug>.gen.ts: lo lee scripts/density_gate.mjs para descontar el tiempo VISIBLE
const avWins = rows.filter((r) => r.tipo === "avatar").map((r) => ({ start: +(r.f0 / FPS).toFixed(2), mode: "full", end: +(r.f1 / FPS).toFixed(2) }));
fs.writeFileSync(`src/_fed6/VideoEdit/avatar_${SLUG}.gen.ts`,
`// GENERADO por build_${SLUG}.mjs — ventanas de avatar a pantalla completa.
export const AVATAR_${UP} = ${JSON.stringify(avWins, null, 1)};
`);

fs.writeFileSync(`src/_fed6/VideoEdit/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarWindow, ReframedVideo, PhotoScene } from "../../fcspuntos/Piezas";
import {
  THEME_MEDICO, HookCaption, PullQuote, KaraokePhrase, HighlightSweep,
  NumberedSteps, ChecklistReveal, BulletCascade,
  BigStatReveal, StatGrid, RankBars, GaugeDial, DonutPercent,
  CutawayCallouts, FlowSteps, CycleLoop, LayerStack,
  ChapterTitle, LowerThirdId, CtaCard, StampBadge, MythTruth,
  VsDuel, BeforeAfter, DuelColumns, TierRanking,
  FramedPhoto, FloatingCutout, PhotoCarousel, SplitPanel,
} from "./kit/premium";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { PhotoBed } from "./scenes/PhotoBed";
import { RayCta } from "../../fcsclv/RayCta";
import FedWhiteboard from "../../FedWhiteboard";
import { SCENE_PUNTOS_MEC } from "../../fcspuntos/WhiteboardScene";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const FPS = ${FPS};
const F = (s: number) => Math.round(s * FPS);

type Cue = { key: string; startSec: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES_${UP}: Cue[] = [
${cues.map((c) => `  { key: ${JSON.stringify(c.key)}, startSec: ${c.start}, dur: ${c.dur}, el: (d: number) => ${c.el} },`).join("\n")}
];

export const OVERLAYS_${UP}: Cue[] = [
${ov.map((c) => `  { key: ${JSON.stringify(c.key)}, startSec: ${c.start}, dur: ${c.dur}, el: (d: number) => ${c.el} },`).join("\n")}
];

export const Main${COMP}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#08110F" }}>
    {CUES_${UP}.map((c) => (
      <Sequence key={c.key} from={F(c.startSec)} durationInFrames={Math.max(1, F(c.dur))} layout="none">
        <AbsoluteFill>{c.el(Math.max(1, F(c.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    {OVERLAYS_${UP}.map((o) => (
      <Sequence key={o.key} from={F(o.startSec)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}
    <Audio src={staticFile(${JSON.stringify(WAV_FILE)})} />
  </AbsoluteFill>
);
`);

fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./_fed6/VideoEdit/Main_${SLUG}";

const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ── _v3/<slug>_cues.json: capa BASE (clips/fotos) que mide la repetición de agnes_qc
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(
  rows.filter((b) => b.tipo === "clip" || b.tipo === "imagen")
      .map((b) => ({ key: `${b.tipo}_${b.f0}`, src: b.src, start: +(b.f0 / FPS).toFixed(3), dur: +((b.f1 - b.f0) / FPS).toFixed(3) })), null, 1));

const lista = [];
for (const a of [...assets].sort()) {
  lista.push(a);
  if (/\.(png|jpe?g)$/i.test(a)) { const b = a.replace(/\.(png|jpe?g)$/i, "_blur.jpg"); if (existe(b)) lista.push(b); }
}
fs.writeFileSync(`_${SLUG}_assets.txt`, lista.join("\n") + "\n");
const kinds = {}; for (const b of rows) if (b.tipo === "componente") kinds[b.componente] = (kinds[b.componente] || 0) + 1;
console.log(`cues ${cues.length} · overlays ${ov.length} · componentes ${Object.values(kinds).reduce((a, b) => a + b, 0)} en ${Object.keys(kinds).length} tipos`);
console.log(`assets ${assets.size} (+blur ${lista.length}) · TOTAL ${TOTAL_FRAMES} frames = ${(TOTAL_S / 60).toFixed(2)} min`);
