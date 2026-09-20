// scripts/rksafe_build.mjs — genera Main, cues y frames del avatar desde el plan (camino rksafe).
//   node scripts/rksafe_build.mjs <slug>
//
// ⛔ Nada se inventa acá: cada cue sale de `_v3/<slug>_plan.json`. Lo que se renderiza FUERA del
//    beatsheet no lo ve ninguna compuerta.
// ⛔ Los OVERLAY (el CTA) van en su propia lista: son tarjetas de esquina que van ENCIMA del avatar.
//    Un overlay en la capa base abre segundos de fondo muerto debajo.
// ⛔ `OffthreadVideo` SIEMPRE (lo impone RayStage) — `<Video>` sirve cuadros equivocados en el render.
// ⛔ El `seed` de cada foto es su CUADRO DE ARRANQUE y `durF` su duración: el Ken-Burns necesita las
//    dos cosas para sortear sentido/velocidad y para atar el paneo a la escala.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SLUG = process.argv[2];
if (!SLUG) { console.error('uso: node scripts/rksafe_build.mjs <slug>'); process.exit(1); }
const Cap = SLUG.charAt(0).toUpperCase() + SLUG.slice(1);
const UP = SLUG.toUpperCase();
const cfg = await import('file:///' + path.resolve(process.cwd(), `_v3/${SLUG}_cfg.mjs`).replace(/\\/g, '/'));

const plan = JSON.parse(fs.readFileSync(`_v3/${SLUG}_plan.json`, 'utf8'));
const FPS = plan.fps;
const TOTAL_F = Math.round(plan.total * FPS);
const AVATAR_F = Math.round(plan.avatarEnd * FPS);
const OVERLAY = new Set(cfg.OVERLAY);
// ⛔⛔ MODO VENTANAS: el avatar NO es una capa continua. Fuera de las ventanas el fondo es NEGRO,
//    asi que cada ventana se monta como un plano mas de la capa base con `RayAvatarWin` (media
//    panel 960x540 = upscale 1,154x; `RayAvatar` a pantalla completa es 2,31x y el creador lo rechazo).
const MODO = cfg.AVATAR_MODO || 'fondo';
// ⛔ LA CONVENCION LA FIJA `scripts/rksafe_avatar.mjs`, que es quien las escribe:
//    `public/broll/<slug>/av_wNNN.mp4` (960x540, 30/1 CFR). Si el build las busca en otro lado,
//    el pre-vuelo del farm da 'faltan 51 assets' sobre archivos que estan en disco.
const AVDIR = `broll/${SLUG}`;
const CAM = cfg.CAM;
const idDeAsset = (a) => (a || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '');

// ⛔ UN CLIP NUNCA SE ESTIRA MÁS ALLÁ DE SU ARCHIVO. `Clip` no loopea (y `loop` no es una prop de
//    OffthreadVideo: el clip se CONGELA en su último cuadro el resto del slot, el "plano muerto").
//    Se mide cada archivo con ffprobe y se exige dur_slot * rate <= dur_archivo.
let clipsCortos = 0;

const durDe = (rel) => {
  try {
    const o = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
      '-of', 'csv=p=0', 'public/' + rel], { encoding: 'utf8' });
    const m = o.match(/[\d.]+/); return m ? +m[0] : 0;
  } catch { return 0; }
};
// ⛔⛔ EL MAIN REDONDEA `from` Y `durationInFrames` POR SEPARADO. `F(53.94) + F(0.98)` no cae en
//    `F(54.92)`: según el resto, el cue siguiente arranca un cuadro ANTES (solape: un plano tapa al
//    otro) o un cuadro DESPUÉS (destello de 33 ms del fondo, que `blackdetect` no ve porque pide
//    0,4 s). Medido acá antes del arreglo: 10 solapes y 2 destellos.
//    Se alinean los cuadros ACÁ, derivando la duración del CUADRO FINAL y no del largo.
{
  const OVs = new Set(cfg.OVERLAY);
  const baseB = plan.beats.filter((b) => !(b.kind === 'componente' && OVs.has(b.comp))).sort((a, b) => a.t - b.t);
  let pegados = 0, recortados = 0;
  for (let i = 0; i < baseB.length; i++) {
    const f0 = Math.round(baseB[i].t * FPS);
    let f1 = f0 + Math.max(1, Math.round(baseB[i].dur * FPS));
    const sig = baseB[i + 1];
    if (sig) {
      const sf0 = Math.round(sig.t * FPS);
      if (Math.abs(sf0 - f1) <= 3 && sf0 > f0) { f1 = sf0; pegados++; }
      else if (f1 > sf0) { f1 = Math.max(f0 + 1, sf0); pegados++; }
    }
    // ⛔⛔ UN CLIP NO SE ESTIRA PARA CERRAR LA FRONTERA. `Clip` no loopea: pasado el ultimo cuadro
    //    `OffthreadVideo` CONGELA, y `agnes_qc_gate` lo cuenta como repeticion. Medido aca: la
    //    alineacion estiraba 3 clips 0,14-0,32 s sobre su archivo. Cuando el tope no da, el que se
    //    mueve es el ARRANQUE DEL SIGUIENTE, no el final de este.
    if (baseB[i].kind === 'clip') {
      const df = durDe(baseB[i].asset);
      const tope = f0 + Math.max(1, Math.floor((df - 0.02) / (baseB[i].rate ?? 1) * FPS));
      if (f1 > tope) { f1 = tope; if (sig) sig.t = f1 / FPS; recortados++; }
    }
    baseB[i].t = f0 / FPS;
    baseB[i].dur = Math.max(1, f1 - f0) / FPS;
  }
  console.log('fronteras alineadas al cuadro: ' + pegados + ' de ' + baseB.length + ' · clips recortados a su archivo: ' + recortados);
  // ⛔⛔ PASADA DE CIERRE: recortar un clip a su archivo deja un HUECO, y en modo VENTANAS un hueco
  //    es NEGRO en pantalla. Medido aca: 4 huecos, 2,16 s, cobertura 99,8 %.
  //    Quien cierra tiene que ser ESTIRABLE: una foto o un componente se estiran sin romper nada;
  //    un CLIP se congelaria y una VENTANA DE AVATAR no se puede mover ni alargar (su audio se corto
  //    en milisegundos exactos: correrla desincroniza el lipsync).
  {
    const ESTIRABLE = new Set(['imagen', 'componente']);
    let cerrados = 0, sinCerrar = 0;
    for (let i = 1; i < baseB.length; i++) {
      const prev = baseB[i - 1];
      const hueco = baseB[i].t - (prev.t + prev.dur);
      if (hueco <= 0.011) continue;
      if (ESTIRABLE.has(prev.kind)) { prev.dur = +(baseB[i].t - prev.t).toFixed(5); cerrados++; }
      else if (ESTIRABLE.has(baseB[i].kind)) {
        baseB[i].dur = +(baseB[i].dur + hueco).toFixed(5);
        baseB[i].t = +(prev.t + prev.dur).toFixed(5);
        cerrados++;
      } else sinCerrar++;
    }
    console.log('huecos de recorte cerrados: ' + cerrados + (sinCerrar ? ' · ⛔ SIN CERRAR ' + sinCerrar : ' ✓'));
  }
  // ⛔ y se PERSISTE el plan alineado: si el gate de timeline mide el plan CRUDO y el render usa
  //    el alineado, la compuerta está midiendo otra cosa que la que se ve. Orden: plan -> build -> gates.
  fs.writeFileSync(`_v3/${SLUG}_plan.json`, JSON.stringify(plan, null, 1));
  // ⛔⛔ Y LAS VENTANAS DE AVATAR SE VUELVEN A EMITIR **DESPUES** DE ALINEAR. El plan las escribe
  //    con los tiempos crudos y el build mueve cada frontera hasta 3 cuadros: si el reel de audio se
  //    corta de la version cruda, cada ventana queda hasta 100 ms corrida contra su propio lipsync.
  //    El reel SIEMPRE se corta de este archivo, no del que emitio el plan.
  if (MODO === 'ventanas') {
    const wins = plan.beats.filter((b) => b.kind === 'avatar').sort((a, b) => a.win - b.win)
      .map((b) => ({ i: b.win, t: +b.t.toFixed(3), dur: +b.dur.toFixed(3) }));
    fs.writeFileSync(`_v3/${SLUG}_avwins.json`, JSON.stringify(wins, null, 1));
    console.log('ventanas de avatar reemitidas ya alineadas al cuadro: ' + wins.length);
  }
}

const usados = new Set();
const cues = [], overlays = [];
let nCam = 0, nClip = 0, nAv = 0;
let ultimaFoto = null;
const avBeds = new Set();

for (const b of plan.beats) {
  const key = `${b.kind}_${Math.round(b.t * 1000)}`;
  const seed = Math.round(b.t * FPS);
  let el;
  const camId = (b.kind === 'clip' || b.kind === 'imagen') ? idDeAsset(b.asset) : null;
  if (camId && CAM[camId]) {
    // ⛔ `image` es OBLIGATORIA aunque haya clip: es la cama de foto de abajo. Sin ella, si el clip
    //    es más corto que el slot queda el fondo plano a la vista.
    const cam = CAM[camId];
    const clipProp = b.kind === 'clip' ? ` clip={${JSON.stringify(b.asset)}}` : '';
    el = `(d) => <RaySecurityCam image={${JSON.stringify('img/' + camId + '.jpg')}}${clipProp} ` +
      `label={${JSON.stringify(cam.label)}} date=${JSON.stringify(cfg.CAM_DATE)} clockStart={${cfg.CLOCK0 + cam.off}} intensity={1} push />`;
    usados.add('RaySecurityCam');
    nCam++;
  } else if (b.kind === 'clip') {
    const df = durDe(b.asset);
    const necesita = b.dur * (b.rate ?? 1);
    if (!df) { console.error('⛔ clip ilegible: ' + b.asset); process.exit(3); }
    if (necesita > df + 0.02) { console.log(`  ⛔ ${b.asset}: el plano pide ${necesita.toFixed(2)}s de fuente y el archivo tiene ${df.toFixed(2)}s (se congelaría)`); clipsCortos++; }
    el = `(d) => <Clip src=${JSON.stringify(b.asset)} rate={${b.rate ?? 1}} />`;
    nClip++;
  } else if (b.kind === 'avatar') {
    const rel = `${AVDIR}/av_w${String(b.win).padStart(3, '0')}.mp4`;
    // la CAMA de foto del plano anterior llena el resto del cuadro (el panel es 960x540, no full)
    const bedRel = b.bed || ultimaFoto;
    const bedProp = bedRel ? ` bed=${JSON.stringify(bedRel)}` : '';
    el = `(d) => <RayAvatarWin src=${JSON.stringify(rel)} seed={${seed}} durF={d}${bedProp} />`;
    if (bedRel) avBeds.add(bedRel);
    nAv++;
  } else if (b.kind === 'imagen') {
    el = `(d) => <Foto src=${JSON.stringify(b.asset)} seed={${seed}} durF={d} />`;
  } else {
    usados.add(b.comp);
    const props = { ...b.props };
    if (b.bed && !OVERLAY.has(b.comp)) props.bed = b.bed;   // los overlay no llevan cama de foto
    el = `(d) => <${b.comp} durationInFrames={d} {...(${JSON.stringify(props)} as any)} />`;
  }
  if (camId) ultimaFoto = 'img/' + camId + '_blur.jpg';
  const row = `  { key: ${JSON.stringify(key)}, start: ${b.t}, dur: ${b.dur}, el: ${el} },`;
  (b.kind === 'componente' && OVERLAY.has(b.comp) ? overlays : cues).push(row);
}

const compsNecesarios = [...usados].sort();
for (const c of compsNecesarios) if (!cfg.IMPORTS[c]) { console.error('⛔ no sé de dónde importar ' + c); process.exit(1); }

const cuesSrc = `// cues_${SLUG}.gen.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
${compsNecesarios.map((c) => `import { ${c} } from "${cfg.IMPORTS[c]}";`).join('\n')}
import { Clip, Foto } from "../rksafe/RayStage";
${MODO === 'ventanas' ? 'import { RayAvatarWin } from "../rksafe/RayAvatarWin";' : ''}

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.join('\n')}
];

export const OVERLAYS: Cue[] = [
${overlays.join('\n')}
];
`;

const avatarSrc = `// avatar_${SLUG}.gen.ts — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
export const TOTAL_FRAMES_${UP} = ${TOTAL_F};
export const AVATAR_FRAMES_${UP} = ${AVATAR_F};
`;

const mainSrc = `// Main_${SLUG}.tsx — GENERADO por scripts/rksafe_build.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
${MODO === 'ventanas' ? '' : 'import { RayAvatar } from "../rksafe/RayStage";'}
import { CUES, OVERLAYS } from "./cues_${SLUG}.gen";
import { TOTAL_FRAMES_${UP}, AVATAR_FRAMES_${UP} } from "./avatar_${SLUG}.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const Main${Cap}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
${MODO === 'ventanas'
    ? '{/* MODO VENTANAS: no hay avatar de fondo. El fondo es NEGRO y la cobertura tiene que dar 100 %. */}'
    : '{/* El avatar es el FONDO GARANTIZADO. */}' + String.fromCharCode(10) + '    <RayAvatar src="' + SLUG + '_opt.mp4" loopFrames={AVATAR_FRAMES_' + UP + '} />'}

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))} layout="none">
        <AbsoluteFill>{cue.el(Math.max(1, F(cue.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* overlays: van ENCIMA, no ocultan la base */}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))} layout="none">
        <AbsoluteFill>{o.el(Math.max(1, F(o.dur)))}</AbsoluteFill>
      </Sequence>
    ))}

    {/* UN solo <Audio> con el master */}
    <Audio src={staticFile("${SLUG}.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_${UP} };
`;

const entrySrc = `import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${Cap}, TOTAL_FRAMES_${UP} } from "./VideoEdit/Main_${SLUG}";

const Root${Cap}: React.FC = () => (
  <Composition id="${Cap}" component={Main${Cap}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${Cap});
`;

fs.writeFileSync(`src/VideoEdit/cues_${SLUG}.gen.tsx`, cuesSrc);
fs.writeFileSync(`src/VideoEdit/avatar_${SLUG}.gen.ts`, avatarSrc);
fs.writeFileSync(`src/VideoEdit/Main_${SLUG}.tsx`, mainSrc);
fs.writeFileSync(`src/index_${SLUG}.tsx`, entrySrc);

console.log('═'.repeat(66));
console.log('CUES     : ' + cues.length + '  ·  OVERLAYS: ' + overlays.length + '  ·  clips medidos con ffprobe: ' + nClip +
  '  ·  que se congelarían: ' + clipsCortos + (clipsCortos ? ' ⛔' : ' ✓'));
if (MODO === 'ventanas') console.log('VENTANAS DE AVATAR: ' + nAv + ' planos RayAvatarWin (panel 960x540 = upscale 1,154x)');
console.log('CÁMARA DE VIGILANCIA: ' + nCam + ' planos ' + (nCam >= 8 ? '✓' : '⛔ el hook se va a ver como una foto quieta'));
console.log('COMPONENTES importados: ' + compsNecesarios.length + ' → ' + compsNecesarios.join(' · '));
console.log('TOTAL_FRAMES: ' + TOTAL_F + ' (' + plan.total.toFixed(2) + ' s)  ·  AVATAR_FRAMES: ' + AVATAR_F);
if (!overlays.length) console.log('⚠️ 0 overlays — ¿el CTA quedó en la capa base?');

// ── COMPUERTA: todo asset referenciado tiene que EXISTIR y viajar en el tar ─────────────
const assets = new Set();
let faltan = 0, chequeados = 0;
for (const b of plan.beats) {
  const rutas = [];
  if (b.asset) rutas.push(b.asset);
  if (b.bed) rutas.push(b.bed);
  if (b.kind === 'imagen' || (b.asset || '').endsWith('.mp4')) {
    const id = idDeAsset(b.asset);
    if (CAM[id]) rutas.push('img/' + id + '.jpg');     // la cama de foto del tratamiento de cámara
  }
  for (const r of rutas) { chequeados++; assets.add(r); if (!fs.existsSync('public/' + r)) { console.log('  ⛔ falta public/' + r); faltan++; } }
}
// el hermano _blur.jpg lo pide el kit en RUNTIME: no sale de ningún beat
for (const a of [...assets]) if (a.endsWith('.jpg') && !a.endsWith('_blur.jpg')) {
  const bl = a.replace(/\.jpg$/, '_blur.jpg');
  assets.add(bl);
  if (!fs.existsSync('public/' + bl)) { console.log('  ⛔ falta public/' + bl + ' (hermano _blur, se pide en runtime)'); faltan++; }
}
for (const bd of avBeds) { chequeados++; assets.add(bd); if (!fs.existsSync('public/' + bd)) { console.log('  ⛔ falta public/' + bd + ' (cama del avatar)'); faltan++; } }
for (const b of plan.beats) if (b.kind === 'avatar') {
  const r = `${AVDIR}/av_w${String(b.win).padStart(3, '0')}.mp4`;
  chequeados++; assets.add(r);
  if (!fs.existsSync('public/' + r)) { console.log('  ⛔ falta public/' + r); faltan++; }
}
for (const extra of (MODO === 'ventanas' ? [`${SLUG}.m4a`, `img/${SLUG}_qr.png`] : [`${SLUG}_opt.mp4`, `${SLUG}.m4a`, `img/${SLUG}_qr.png`])) {
  assets.add(extra);
  const ok = fs.existsSync('public/' + extra);
  console.log('  ' + (ok ? '✓' : '⛔') + ' public/' + extra);
  if (!ok) faltan++;
}
fs.writeFileSync(`_${SLUG}_assets.txt`, [...assets].sort().join('\n') + '\n');
// el farm exige la medición de REPETICIÓN de agnes_qc, y ésa sale de la capa base del montaje
fs.writeFileSync(`_v3/${SLUG}_cues.json`, JSON.stringify(plan.beats
  .filter((b) => b.asset)
  .map((b) => ({ key: `${b.kind}_${Math.round(b.t * 1000)}`, src: b.asset, start: b.t, dur: b.kind === 'clip' ? b.dur * (b.rate ?? 1) : b.dur })), null, 1));
console.log('ASSETS   : ' + chequeados + ' referenciados · ' + assets.size + ' en la lista · ' + faltan + ' faltan ' + (faltan ? '⛔' : '✓'));
console.log('→ src/VideoEdit/Main_' + SLUG + '.tsx · cues · avatar · src/index_' + SLUG + '.tsx · _' + SLUG + '_assets.txt');
console.log('═'.repeat(66));
if (faltan || clipsCortos) process.exit(2);
