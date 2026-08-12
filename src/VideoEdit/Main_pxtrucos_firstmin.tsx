// PRIMER MINUTO (preview) — canal Agua Oxigenada, video pxtrucos (ES).
// Trailer de cine súper intenso: escalada a clímax en el #5 (carta dorada = techo = $400).
// Anclado a los ms REALES de Whisper (_v3/pxtrucos_firstmin_plan.json). Self-contained
// (CUES/OVERLAYS/AVATAR_WINDOWS inline) para rendear SOLO el minuto en el farm.
import { AbsoluteFill, Sequence } from "remotion";
import type { ReactNode } from "react";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, type AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { LightTrailCards, NodeRingToggle, BottleHero, GlitchCut } from "../peroxide/PeroxideHero";
import {
  BigStatReveal,
  BulletCascade,
  MythTruth,
  HighlightSweep,
  HookCaption,
  THEME_PEROXIDE,
} from "./kit/premium";

const PX = THEME_PEROXIDE;
export const TOTAL_FRAMES_PXTRUCOS_FM = Math.round(66.2 * 30); // ~1986

type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

// ── FULL-BLEED (componentes firma del canal) ──────────────────────────────────
const CUES: Cue[] = [
  // 1 · "esta botellita marrón" — abre con el objeto héroe + destape/pop
  { key: "b1_bottle", start: 0, dur: 2.94, el: (d) => (
    <BottleHero durationInFrames={d} eyebrow="Esta botellita marrón" phrase="cuesta *un dólar*" uncap sfx />
  ) },
  // 6 · callback botella (sin destape) — cierra el contraste $400 → $1
  { key: "b6_bottle", start: 20.86, dur: 3.10, el: (d) => (
    <BottleHero durationInFrames={d} eyebrow="Y lo resuelve" phrase="una botella de *un dólar*" sfx={false} />
  ) },
  // 7 · reveal de scope: los 9 trucos abren en abanico
  { key: "b7_fan", start: 23.96, dur: 4.64, el: (d) => (
    <LightTrailCards durationInFrames={d} eyebrow="9 maneras, afuera de tu casa" phrase="que los *profesionales* no te cuentan" number="#9" cards={9} sfx />
  ) },
  // 12 · "está vivo / la química lo mata" — toggle sucio→limpio
  { key: "b12_toggle", start: 49.94, dur: 5.36, el: (d) => (
    <NodeRingToggle durationInFrames={d} eyebrow="Está vivo" phrase="y la química *lo mata*" nodes={8} sfx />
  ) },
  // 14 · CLÍMAX: la baraja abre y la carta #5 sobresale DORADA (techo = $400)
  { key: "b14_gold", start: 59.56, dur: 6.58, el: (d) => (
    <LightTrailCards durationInFrames={d} eyebrow="Y el número cinco" phrase="es *el techo* — cuatrocientos dólares" number="#5" cards={9} goldCard={4} goldAt={52} sfx />
  ) },
];

// ── OVERLAYS (premium themeado + glitch de transición al avatar) ───────────────
const OVERLAYS: Cue[] = [
  // 2 · odómetro $1 (ancla barata)
  { key: "b2_stat1", start: 2.94, dur: 5.22, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="topLeft" theme={PX}>
      <BigStatReveal durationInFrames={d} theme={PX} eyebrow="Lo que cuesta en la farmacia" prefix="$" value={1} support="un dólar, uno cincuenta" source="botella de agua oxigenada al 3%" />
    </PremiumOverlay>
  ) },
  // glitch → avatar (beat 3)
  { key: "glitch_8", start: 8.02, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
  // 4 · frase cinética que escala a "TRESCIENTOS"
  { key: "b4_hook", start: 11.6, dur: 5.12, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="center" theme={PX}>
      <HookCaption durationInFrames={d} theme={PX} words={[{ text: "Una empresa" }, { text: "de hidrolavado" }, { text: "te cobra" }, { text: "TRESCIENTOS", boxed: true }]} sub="…para limpiar lo que una botella de $1 resuelve" />
    </PremiumOverlay>
  ) },
  // 5 · SLAM $400 (pico del contraste)
  { key: "b5_stat400", start: 16.72, dur: 4.14, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="topLeft" theme={PX}>
      <BigStatReveal durationInFrames={d} theme={PX} eyebrow="Lo que cobra el profesional" prefix="$" value={400} support="por limpiar la misma mugre" source="visita promedio de hidrolavado" />
    </PremiumOverlay>
  ) },
  // 8 · marcador sobre "20 años más viejo"
  { key: "b8_hl", start: 28.6, dur: 6.44, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="top" theme={PX}>
      <HighlightSweep durationInFrames={d} theme={PX} pre="Esa película del deck lo hace ver " highlight="20 años más viejo" post=" de lo que es." note="y no es la madera: es alga viva" />
    </PremiumOverlay>
  ) },
  // 9 · mito → verdad
  { key: "b9_myth", start: 35.04, dur: 6.26, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="topLeft" theme={PX}>
      <MythTruth durationInFrames={d} theme={PX} myth="Solo para la rodilla raspada" truth="Mata algas, moho y humedad" mythLabel="MITO" truthLabel="VERDAD" />
    </PremiumOverlay>
  ) },
  // glitch → avatar (beat 10)
  { key: "glitch_41", start: 41.2, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
  // 11 · "los pros" en cascada
  { key: "b11_bullets", start: 43.7, dur: 6.24, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="left" theme={PX}>
      <BulletCascade durationInFrames={d} theme={PX} eyebrow="Los que lo hacen para vivir" bullets={[{ pre: "Las ", key: "cuadrillas de lavado suave" }, { pre: "Las ", key: "empresas de exteriores" }, { pre: "Los ", key: "que te cobran la visita" }]} />
    </PremiumOverlay>
  ) },
  // glitch → avatar (beat 13)
  { key: "glitch_55", start: 55.1, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
];

// ── AVATAR: full en los golpes de rostro (beats 3,10,13), hidden en el resto ──
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "hidden" },
  { start: 8.16, mode: "full" },
  { start: 11.6, mode: "hidden" },
  { start: 41.3, mode: "full" },
  { start: 43.7, mode: "hidden" },
  { start: 55.3, mode: "full" },
  { start: 59.56, mode: "hidden" },
];

export const MainPxtrucosFm: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="red" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="pxtrucosfm_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
