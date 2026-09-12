import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_oxigenada.gen";
import { AVATAR_WINDOWS, TOTAL_OXIGENADA } from "./avatar_oxigenada.gen";

// ── "25 Usos del Agua Oxigenada que los Amish Guardaron 60 Años" — Levi Lapp Jardín ──
// STOCK-FIRST (Pexels) + IA solo del presentador Levi + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. Música de fondo (Field Notes in Dm) en loop, bien abajo,
// con un swell suave durante el hook (tensión) y baja para el resto.
export const TOTAL_FRAMES_OXIGENADA = Math.round(TOTAL_OXIGENADA * 30);

// Música: base ~0.11, sube a ~0.17 durante el bloque de horror del hook (~4s→28s),
// baja de nuevo antes del cuerpo. Nunca compite con la voz.
const MusicBed: React.FC = () => {
  const f = useCurrentFrame();
  const s = f / 30;
  const vol = interpolate(
    s,
    [0, 4, 10, 24, 30, TOTAL_OXIGENADA - 6, TOTAL_OXIGENADA],
    [0.06, 0.12, 0.17, 0.17, 0.11, 0.11, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("oxigenada_music.mp3")} loop volume={vol} />;
};

export const MainOxigenada: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="oxigenada_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
          {OVERLAYS.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <MusicBed />
        </AbsoluteFill>
      </CinematicWrap>
    </AbsoluteFill>
  );
};
