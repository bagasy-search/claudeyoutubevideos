// PRIMER MINUTO (preview v2 — FOOTAGE-FIRST) — canal Agua Oxigenada, video pxtrucos (ES).
// Cada frase concreta pega a su clip REAL de Pexels (public/broll/pxtrucosfm_*.mp4).
// Componentes SOLO en los 5 golpes que no se pueden filmar: BottleHero (el producto),
// BigStatReveal $400 (el golpe de plata), MythTruth (mito rodilla), HighlightSweep ("20 años"),
// LightTrailCards gold (#5 = techo = $400, cierre). Anclado a los ms reales de Whisper.
import { AbsoluteFill, Sequence } from "remotion";
import type { ReactNode } from "react";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer, type AvatarWindow } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { RawShot } from "./scenes/RawShot";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { LightTrailCards, BottleHero, GlitchCut } from "../peroxide/PeroxideHero";
import { BigStatReveal, MythTruth, HighlightSweep, THEME_PEROXIDE } from "./kit/premium";

const PX = THEME_PEROXIDE;
export const TOTAL_FRAMES_PXTRUCOS_FM = Math.round(68.5 * 30); // ~2055

type Cue = { key: string; start: number; dur: number; el: (d: number) => ReactNode };

// helper para clips reales
const shot = (src: string, clipDur: number) => (d: number) => (
  <RawShot durationInFrames={d} src={`broll/${src}.mp4`} hue="red" darken={0.06} clipDur={clipDur} />
);

// ── FULL-BLEED: clips reales (footage) + los 2 componentes full-bleed (botella, abanico) ──
const CUES: Cue[] = [
  // 1 · "esta botellita marrón" → el producto (hero real del canal)
  { key: "c01_bottle", start: 0, dur: 2.94, el: (d) => (
    <BottleHero durationInFrames={d} eyebrow="Esta botellita marrón" phrase="cuesta *un dólar*" uncap sfx />
  ) },
  // 2 · "un dólar cincuenta en la farmacia" → estante de farmacia REAL
  { key: "c02_pharmacy", start: 2.94, dur: 5.22, el: shot("pharmacyshelf", 54.6) },
  // (8.16–11.04 avatar full)
  // 3 · "el dueño de casa promedio" → casa suburbana REAL
  { key: "c03_house", start: 11.04, dur: 2.66, el: shot("house", 31.0) },
  // 4 · "una empresa de hidrolavado te cobra" → hidrolavado REAL
  { key: "c04_wash", start: 13.7, dur: 3.02, el: shot("pressurewash", 30.0) },
  // (16.72–20.86 overlay $400)
  // 5 · "la misma mugre que esta botella resuelve" → verter líquido REAL
  { key: "c05_pour", start: 20.86, dur: 3.1, el: shot("pour", 6.75) },
  // 6 · "lo verde que te sube por el revestimiento" → alga verde en pared REAL
  { key: "c06_algaewall", start: 23.96, dur: 2.48, el: shot("algaewall", 34.2) },
  // 7 · "las rayas negras del techo" → tejas REAL
  { key: "c07_roof", start: 26.44, dur: 2.16, el: shot("roofshingles", 44.0) },
  // 8 · "esa película resbalosa del deck" → deck gris gastado REAL
  { key: "c08_deck", start: 28.6, dur: 3.64, el: shot("deck", 4.09) },
  // (32.24–34.54 overlay HighlightSweep "20 años")
  // 9 · "eso que te echás en la rodilla raspada" → primeros auxilios REAL
  { key: "c09_wound", start: 34.54, dur: 2.56, el: shot("wound", 19.0) },
  // (37.10–41.18 overlay MythTruth)
  // (41.18–43.18 avatar full)
  // 10 · "los que hacen esto para vivir" → obrero rociando REAL
  { key: "c10_worker", start: 43.18, dur: 2.7, el: shot("worker", 28.1) },
  // 11 · "las cuadrillas de lavado suave" → rociar pared REAL
  { key: "c11_washwall", start: 45.88, dur: 1.68, el: shot("washwall", 12.8) },
  // 12 · "las empresas de limpieza de exteriores" → cuadrilla uniformada REAL
  { key: "c12_service", start: 47.56, dur: 2.38, el: shot("service", 15.1) },
  // 13 · "lo que le hace a las algas" → alga/musgo macro REAL
  { key: "c13_algae", start: 49.94, dur: 3.46, el: shot("algae_macro", 11.2) },
  // 14 · "al moho y a la humedad" → moho macro REAL
  { key: "c14_mold", start: 53.4, dur: 1.9, el: shot("mold_macro", 8.43) },
  // (55.30–59.56 avatar full)
  // 15 · "cada patio con musgo" → musgo entre piedras REAL
  { key: "c15_moss", start: 59.56, dur: 1.74, el: shot("moss_patio", 47.3) },
  // 16 · "cada techo con rayas" → techo aéreo REAL
  { key: "c16_roof2", start: 61.3, dur: 1.56, el: shot("roof_streaks", 29.5) },
  // 17 · "cada entrada de auto sucia" → entrada/piso manchado REAL
  { key: "c17_driveway", start: 62.86, dur: 1.72, el: shot("oilstain", 34.1) },
  // 18 · CLÍMAX "eso es plata" → la carta #5 DORADA (techo = $400)
  { key: "c18_gold", start: 64.58, dur: 3.92, el: (d) => (
    <LightTrailCards durationInFrames={d} eyebrow="Y el número cinco" phrase="es *el techo* — cuatrocientos dólares" number="#5" cards={9} goldCard={4} goldAt={22} sfx />
  ) },
];

// ── OVERLAYS: los 3 golpes de componente sobre negro + glitch al avatar ──
const OVERLAYS: Cue[] = [
  { key: "gl_08", start: 8.02, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
  // $400 SLAM (el golpe de plata del profesional)
  { key: "ov_400", start: 16.72, dur: 4.14, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="topLeft" theme={PX}>
      <BigStatReveal durationInFrames={d} theme={PX} eyebrow="Lo que cobra el profesional" prefix="$" value={400} support="por limpiar la misma mugre" source="visita promedio de hidrolavado" />
    </PremiumOverlay>
  ) },
  // "20 años más viejo" — marcador
  { key: "ov_hl", start: 32.24, dur: 2.3, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="top" theme={PX}>
      <HighlightSweep durationInFrames={d} theme={PX} pre="El deck se ve " highlight="20 años más viejo" post="" note="y no es la madera: es alga viva" />
    </PremiumOverlay>
  ) },
  // mito → verdad
  { key: "ov_myth", start: 37.1, dur: 4.08, el: (d) => (
    <PremiumOverlay durationInFrames={d} zone="topLeft" theme={PX}>
      <MythTruth durationInFrames={d} theme={PX} myth="Solo para la rodilla raspada" truth="Mata algas, moho y humedad" mythLabel="MITO" truthLabel="VERDAD" />
    </PremiumOverlay>
  ) },
  { key: "gl_41", start: 41.02, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
  { key: "gl_55", start: 55.12, dur: 0.4, el: (d) => <GlitchCut durationInFrames={d} /> },
];

// ── AVATAR: full en los 3 golpes de rostro, hidden en el footage ──
const AVATAR_WINDOWS: AvatarWindow[] = [
  { start: 0, mode: "hidden" },
  { start: 8.16, mode: "full" },
  { start: 11.04, mode: "hidden" },
  { start: 41.18, mode: "full" },
  { start: 43.18, mode: "hidden" },
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
