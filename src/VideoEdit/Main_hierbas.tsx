import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_hierbas.gen";
import { AVATAR_WINDOWS, TOTAL_HIERBAS } from "./avatar_hierbas.gen";

// ── "Dile Adiós a los Plaguicidas Caros: Este Truco con Hierbas" — Levi Lapp Jardín ──
// STOCK-FIRST (Pexels) + IA solo del presentador Levi + AVATAR full en tramos retóricos
// + kit premium THEME_EARTH. Look Amish: calmo, avatar full-o-full (sin PiP), b-roll real.
export const TOTAL_FRAMES_HIERBAS = Math.round(TOTAL_HIERBAS * 30);

export const MainHierbas: React.FC = () => {
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
          <AvatarLayer src="hierbas_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
