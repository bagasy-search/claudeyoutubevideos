import { Audio, Sequence, staticFile } from "remotion";

// Rule 9J / 11D — sound design. Drop an SFX at an exact frame, under the voice.
// Files live in public/sfx/. Volume defaults low so it sits below narration.
export const SfxCue: React.FC<{
  at: number; // frame to fire (relative to the enclosing Sequence)
  src: string; // e.g. "sfx/ksjsbwuil-whoosh3-481204.mp3"
  volume?: number;
  durationInFrames?: number;
}> = ({ at, src, volume = 0.5, durationInFrames = 45 }) => (
  <Sequence from={at} durationInFrames={durationInFrames} layout="none">
    <Audio src={staticFile(src)} volume={volume * (SFX_GAIN[src] ?? 1)} />
  </Sequence>
);

// ★ Ganancia por efecto — knob global para domar los SFX fuertes (feedback usuario: el
// zoom irrumpe la atención). Los zoom/boom van atenuados hasta que lleguen los SFX UI
// suaves nuevos. 1 = sin cambio. (Se aplica encima del `volume` de cada SfxCue.)
// El pack nuevo ya es SUAVE → sin atenuación extra (el volumen por-cue alcanza). Vacío.
export const SFX_GAIN: Record<string, number> = {};

// Named map of the user's uploaded SFX pack so scenes reference roles, not files.
export const SFX = {
  // ★ PACK SUAVE (ElevenLabs, jun 2026) — orgánico, satisfactorio, NADA futurista.
  // Reemplaza los whoosh/booms/zoom fuertes anteriores en TODOS los roles usados.
  whoosh: "sfx/sfx_whoosh_soft.mp3",
  whoosh2: "sfx/sfx_whoosh_soft.mp3",
  swish: "sfx/sfx_trans4.mp3",
  shutter: "sfx/universfield-camera-shutter-199580.mp3",
  transition: "sfx/sfx_trans3.mp3",
  popUp: "sfx/sfx_pop.mp3",
  pop1: "sfx/sfx_pop.mp3",
  pop2: "sfx/sfx_pop.mp3",
  pop3: "sfx/sfx_pop.mp3",
  pop4: "sfx/sfx_pop.mp3",
  click: "sfx/sfx_paper_tick.mp3",
  ui1: "sfx/sfx_pop.mp3",
  ui2: "sfx/sfx_pop.mp3",
  ui3: "sfx/sfx_pop.mp3",
  ui4: "sfx/sfx_pop.mp3",
  ui5: "sfx/sfx_pop.mp3",
  ui6: "sfx/sfx_pop.mp3",
  ui7: "sfx/sfx_pop.mp3",
  ui8: "sfx/sfx_pop.mp3",
  ui9: "sfx/sfx_pop.mp3",
  close: "sfx/sfx_trans4.mp3",
  // golpes graves → ahora un THUMP cálido y suave (no boom cinematográfico)
  boom1: "sfx/sfx_thump.mp3",
  boom2: "sfx/sfx_thump.mp3",
  zoomHit: "sfx/sfx_whoosh_soft.mp3",
  camZoomPunch: "sfx/sfx_whoosh_soft.mp3",
  camTravel: "sfx/sfx_whoosh_soft.mp3",
  camZoomOut: "sfx/sfx_whoosh_soft.mp3",
  lineDraw: "sfx/sfx_trans4.mp3",
  lineArrive: "sfx/sfx_pop.mp3",
  nodeLand: "sfx/sfx_pop.mp3",
  nodePop: "sfx/sfx_pop.mp3",
  barGrow: "sfx/sfx_trans4.mp3",
  barLand: "sfx/sfx_thump.mp3",
  winnerChime: "sfx/sfx_chime.mp3",
  digitTick: "sfx/sfx_paper_tick.mp3",
  numberRoll: "sfx/sfx_paper_tick.mp3",
  numberSlam: "sfx/sfx_thump.mp3",
  layerDrop: "sfx/sfx_thump.mp3",
  markerDrive: "sfx/sfx_whoosh_soft.mp3",
  chipPop3d: "sfx/sfx_pop.mp3",
  textSlam: "sfx/sfx_text_thud.mp3",
  kickerType: "sfx/sfx_paper_tick.mp3",
  sectionSwell: "sfx/sfx_trans2.mp3",
  stingerHit: "sfx/sfx_trans1.mp3",
  ambTaller: "sfx/amb_taller.mp3",
  ambFuego: "sfx/amb_fuego.mp3",
  ambCampo: "sfx/amb_campo.mp3",
  // amb_invierno / cold_winter_wind ELIMINADOS — el viento de invierno suena muy mal,
  // NO usar (decisión del usuario jun 2026). No re-agregar una cama de viento/invierno.
} as const;

// Golpes graves para revelaciones — rotar para que no suenen idénticos.
export const BOOMS = [SFX.boom1, SFX.boom2, SFX.zoomHit] as const;

// Rotate through the pop variants so staggered reveals don't sound identical.
export const POPS = [SFX.pop1, SFX.pop2, SFX.pop3, SFX.pop4, SFX.popUp] as const;
