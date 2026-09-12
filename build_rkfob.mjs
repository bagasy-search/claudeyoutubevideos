// build_rkfob.mjs — genera el Main, los cues y el archivo de frames del avatar desde el plan.
//   node build_rkfob.mjs
//
// ⛔ `RayCta` va en OVERLAYS, no en CUES: es una tarjeta de esquina, tiene que ir ENCIMA del avatar,
//    no en su lugar. Un overlay metido en la capa base abre segundos de fondo muerto debajo.
// ⛔ Todo lo que se renderiza FUERA del beatsheet no lo ve ninguna compuerta → acá no se inventa
//    nada: cada cue sale de `_v3/rkfob_plan.json`.
// ⛔ El `seed` de cada foto es su CUADRO DE ARRANQUE, y `durF` su duración: el Ken-Burns necesita
//    las dos cosas para sortear sentido/velocidad y para que el paneo se ate a la escala.
import fs from 'node:fs';

const plan = JSON.parse(fs.readFileSync('_v3/rkfob_plan.json', 'utf8'));
const FPS = plan.fps;
const TOTAL_F = Math.round(plan.total * FPS);
const AVATAR_F = Math.round(plan.avatarEnd * FPS);

const OVERLAY = new Set(['RayCta']);

// ⛔ EL TRATAMIENTO DE CÁMARA DE VIGILANCIA NO ES UN COMPONENTE APARTE: ES CÓMO SE MONTAN ESTOS
//    PLANOS. Si se dejan como foto normal, el hook —que es el que pidió el creador, "que parezca
//    un video real de una cámara de seguridad"— se ve como una foto quieta de una entrada de noche.
//    `RaySecurityCam` les pone viñeta de gran angular, desaturado frío, barrido, ruido determinista,
//    micro-saltos de cuadro, reloj que corre y el REC parpadeando.
//    El reloj arranca en 03:47:00 = 13.620 s desde medianoche, que es la hora que dice el guion,
//    y avanza en tiempo real dentro de cada plano.
const CAM = {
  // hook: la entrada a las 3:47
  rkfob_s0_01: { label: 'CAM 01 · DRIVEWAY', off: 0 },
  rkfob_s0_02: { label: 'CAM 01 · DRIVEWAY', off: 9 },
  rkfob_s0_03: { label: 'CAM 02 · FRONT WINDOW', off: 21 },
  rkfob_s0_04: { label: 'CAM 01 · DRIVEWAY', off: 28 },
  rkfob_s0_05: { label: 'CAM 01 · DRIVEWAY', off: 33 },
  rkfob_s0_06: { label: 'CAM 01 · DRIVEWAY', off: 38 },
  rkfob_s0_08: { label: 'CAM 02 · FRONT WINDOW', off: 15 },
  // el ataque, contado desde la misma cámara
  rkfob_s4_02: { label: 'CAM 02 · FRONT WINDOW', off: 19 },
  rkfob_s4_03: { label: 'CAM 02 · FRONT WINDOW', off: 24 },
  rkfob_s4_04: { label: 'CAM 01 · DRIVEWAY', off: 30 },
  // cierre: vuelve al MISMO encuadre y al MISMO reloj que el hook
  rkfob_s12_01: { label: 'CAM 01 · DRIVEWAY', off: 0 },
  rkfob_s12_02: { label: 'CAM 01 · DRIVEWAY', off: 38 },
  rkfob_s12_03: { label: 'CAM 01 · DRIVEWAY', off: 44 },
};
const CLOCK0 = 13620;           // 03:47:00 en segundos desde medianoche
const idDeAsset = (a) => (a || '').replace(/^.*\//, '').replace(/\.(jpg|mp4)$/, '');

const usados = new Set();
const cues = [], overlays = [];
let nCam = 0, nCamas = 0;

for (const b of plan.beats) {
  const key = `${b.kind}_${Math.round(b.t * 1000)}`;
  const seed = Math.round(b.t * FPS);
  let el;
  const camId = (b.kind === 'clip' || b.kind === 'imagen') ? idDeAsset(b.asset) : null;
  if (camId && CAM[camId]) {
    // ⛔ `image` es OBLIGATORIA aunque haya clip: es la cama de foto de abajo. Sin ella, si el clip
    //    tarda en montar o es más corto que el slot, queda el fondo plano a la vista.
    const cam = CAM[camId];
    const clipProp = b.kind === 'clip' ? ` clip={${JSON.stringify(b.asset)}}` : '';
    el = `(d) => <RaySecurityCam image={${JSON.stringify('img/' + camId + '.jpg')}}${clipProp} ` +
      `label={${JSON.stringify(cam.label)}} date="03 / 14" clockStart={${CLOCK0 + cam.off}} intensity={1} push />`;
    usados.add('RaySecurityCam');
    nCam++;
  } else if (b.kind === 'clip') {
    el = `(d) => <Clip src=${JSON.stringify(b.asset)} rate={${b.rate ?? 1}} />`;
  } else if (b.kind === 'imagen') {
    el = `(d) => <Foto src=${JSON.stringify(b.asset)} seed={${seed}} durF={d} />`;
  } else {
    usados.add(b.comp);
    const props = { ...b.props };
    // ⛔ los OVERLAY no llevan `bed`: son tarjetas de esquina que van ENCIMA del video, no tienen
    //    cama de foto. `RayCta` ni siquiera declara esa prop → se ignoraba en silencio.
    if (b.bed && !OVERLAY.has(b.comp)) props.bed = b.bed;
    el = `(d) => <${b.comp} durationInFrames={d} {...(${JSON.stringify(props)} as any)} />`;
  }
  const esOverlay = b.kind === 'componente' && OVERLAY.has(b.comp);
  const row = `  { key: ${JSON.stringify(key)}, start: ${b.t}, dur: ${b.dur}, el: ${el} },`;
  (esOverlay ? overlays : cues).push(row);

  // ⛔⛔ UN OVERLAY NO CUBRE NADA — Y DESPUÉS DE `AVATAR_END` ESO SE VE.
  //    Medido acá sobre el render: el `RayCta` arranca en 1313,5 s, el plano de base anterior
  //    termina EXACTAMENTE ahí, y durante sus 8,12 s no queda ningún cue en la capa base →
  //    se ve el AVATAR EN BUCLE, con la boca moviéndose fuera de sincronía, 6,3 minutos después
  //    de que terminó la grabación. Justo en el CTA.
  //    Ninguna compuerta lo veía: no hay negro, hay imagen, el `density_gate` lo contaba como
  //    cobertura porque el beat existe. Es la mina de fcscolageno: "avatar VISIBLE donde no puede
  //    estarlo" nunca se midió.
  //    ✅ Todo overlay lleva su PROPIA cama en la capa base, por su duración exacta.
  if (esOverlay && b.bed) {
    const camaId = b.bed.replace(/^img\//, '').replace(/_blur\.jpg$/, '');
    cues.push(`  { key: ${JSON.stringify(key + '_cama')}, start: ${b.t}, dur: ${b.dur}, ` +
      `el: (d) => <Foto src=${JSON.stringify('img/' + camaId + '.jpg')} seed={${seed}} durF={d} /> },`);
    nCamas++;
  }
}

const compsNecesarios = [...usados].sort();
const IMPORTS = {
  BigStat: '../rksafe/BigStat', CheckCard: '../rksafe/CheckCard', MythTruth: '../rksafe/MythTruth',
  ProcessChips: '../rksafe/ProcessChips', PullQuote: '../rksafe/PullQuote', RayChecklist: '../rksafe/RayChecklist',
  RayCta: '../rksafe/RayCta', RaySecurityCam: '../rksafe/RaySecurityCam', RouteFlow: '../rksafe/RouteFlow',
  SplitVs: '../rksafe/SplitVs', WorstSpots: '../rksafe/WorstSpots',
};
for (const c of compsNecesarios) if (!IMPORTS[c]) { console.error('⛔ no sé de dónde importar ' + c); process.exit(1); }

const cuesSrc = `// cues_rkfob.gen.tsx — GENERADO por build_rkfob.mjs. NO editar a mano.
import React from "react";
${compsNecesarios.map(c => `import { ${c} } from "${IMPORTS[c]}";`).join('\n')}
import { Clip, Foto } from "../rksafe/RayStage";

export type Cue = { key: string; start: number; dur: number; el: (d: number) => React.ReactNode };

export const CUES: Cue[] = [
${cues.join('\n')}
];

export const OVERLAYS: Cue[] = [
${overlays.join('\n')}
];
`;

const avatarSrc = `// avatar_rkfob.gen.ts — GENERADO por build_rkfob.mjs. NO editar a mano.
// El avatar grabado dura ${plan.avatarEnd} s; a partir de ahí corre en BUCLE y sus labios NO
// coinciden con lo que se escucha, por eso el plan cubre ese tramo al ${(100).toFixed(0)}%.
export const TOTAL_FRAMES_RKFOB = ${TOTAL_F};
export const AVATAR_FRAMES_RKFOB = ${AVATAR_F};
`;

const mainSrc = `// Main_rkfob.tsx — GENERADO por build_rkfob.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RayAvatar } from "../rksafe/RayStage";
import { CUES, OVERLAYS } from "./cues_rkfob.gen";
import { TOTAL_FRAMES_RKFOB, AVATAR_FRAMES_RKFOB } from "./avatar_rkfob.gen";

const F = (s: number) => Math.round(s * ${FPS});

export const MainRkfob: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* El avatar es el FONDO GARANTIZADO: parcial (0..${plan.avatarEnd}s) → BUCLE muteado para la cola. */}
    <RayAvatar src="rkfob_opt.mp4" loopFrames={AVATAR_FRAMES_RKFOB} />

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

    {/* UN solo <Audio> con el master: cubre TODO el video (avatar parcial + cola). */}
    <Audio src={staticFile("rkfob.m4a")} />
  </AbsoluteFill>
);

export { TOTAL_FRAMES_RKFOB };
`;

fs.writeFileSync('src/VideoEdit/cues_rkfob.gen.tsx', cuesSrc);
fs.writeFileSync('src/VideoEdit/avatar_rkfob.gen.ts', avatarSrc);
fs.writeFileSync('src/VideoEdit/Main_rkfob.tsx', mainSrc);

console.log('═'.repeat(66));
console.log('CUES     : ' + cues.length + '  ·  OVERLAYS: ' + overlays.length);
console.log('CÁMARA DE VIGILANCIA: ' + nCam + ' planos con el tratamiento RaySecurityCam ' + (nCam >= 8 ? '✓' : '⛔ el hook se va a ver como una foto quieta'));
console.log('COMPONENTES importados: ' + compsNecesarios.length + ' → ' + compsNecesarios.join(' · '));
console.log('TOTAL_FRAMES: ' + TOTAL_F + ' (' + plan.total.toFixed(2) + ' s)  ·  AVATAR_FRAMES: ' + AVATAR_F);
console.log('CAMAS BAJO OVERLAY: ' + nCamas + ' (sin esto se ve el avatar en bucle debajo del CTA) ' + (nCamas === overlays.length ? '✓' : '⛔'));
if (!overlays.length) console.log('⚠️ 0 overlays — ¿el RayCta quedó en la capa base?');

// ── ⛔⛔ COMPUERTA: NINGÚN INSTANTE DESPUÉS DE AVATAR_END SIN CUE DE BASE ─────────────────
// Es la que faltaba y la que dejó pasar los 8,12 s de avatar en bucle debajo del CTA.
// Se simula la capa BASE (sólo CUES, los OVERLAYS no cubren nada) cada 0,1 s.
// ⚠️ Medir sobre los BEATS del plan MIENTE: ahí el RayCta es un beat y cuenta como cobertura.
//    Hay que medir sobre lo que realmente se monta en la capa base.
{
  const baseBeats = plan.beats.filter(b => !(b.kind === 'componente' && OVERLAY.has(b.comp)));
  const camas = plan.beats.filter(b => b.kind === 'componente' && OVERLAY.has(b.comp) && b.bed)
    .map(b => ({ t: b.t, dur: b.dur }));
  const spans = [...baseBeats.map(b => ({ t: b.t, dur: b.dur })), ...camas].sort((a, b) => a.t - b.t);
  let huecos = 0, peor = 0, peorT = 0, medidos = 0;
  for (let t = plan.avatarEnd; t < plan.total - 0.15; t += 0.1) {
    medidos++;
    const cubierto = spans.some(s => s.t <= t && s.t + s.dur > t);
    if (!cubierto) {
      huecos++;
      let run = 0.1, u = t + 0.1;
      while (u < plan.total && !spans.some(s => s.t <= u && s.t + s.dur > u)) { run += 0.1; u += 0.1; }
      if (run > peor) { peor = run; peorT = t; }
    }
  }
  const seg = (huecos * 0.1).toFixed(1);
  console.log('AVATAR EN BUCLE A LA VISTA: instantes medidos ' + medidos + ' · descubiertos ' + huecos +
    ' = ' + seg + ' s' + (huecos ? '  ⛔ el peor de ' + peor.toFixed(1) + ' s en ' +
      Math.floor(peorT / 60) + ':' + String(Math.round(peorT % 60)).padStart(2, '0') : '  ✓'));
  if (medidos < 100) { console.error('⛔ medí ' + medidos + ' instantes — el medidor está roto'); process.exit(3); }
  if (huecos) { console.error('⛔ después de AVATAR_END los labios no coinciden: no se puede ver el avatar ahí'); process.exit(3); }
}

// ── COMPUERTA: todo asset referenciado tiene que EXISTIR ─────────────────
let faltan = 0, chequeados = 0;
for (const b of plan.beats) {
  const rutas = [];
  if (b.asset) rutas.push('public/' + b.asset);
  if (b.bed) rutas.push('public/' + b.bed);
  for (const r of rutas) { chequeados++; if (!fs.existsSync(r)) { console.log('  ⛔ falta ' + r); faltan++; } }
}
console.log('ASSETS   : ' + chequeados + ' referenciados · ' + faltan + ' faltan ' + (faltan ? '⛔' : '✓'));
for (const extra of ['public/rkfob_opt.mp4', 'public/rkfob.m4a', 'public/img/rkfob_qr.png']) {
  console.log('  ' + (fs.existsSync(extra) ? '✓' : '⛔') + ' ' + extra);
  if (!fs.existsSync(extra)) faltan++;
}
console.log('═'.repeat(66));
if (faltan) process.exit(2);
