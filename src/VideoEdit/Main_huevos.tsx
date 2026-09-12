import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_huevos.gen";
import { AVATAR_WINDOWS, TOTAL_HUEVOS } from "./avatar_huevos.gen";

// ── "Why the Amish Never Refrigerate Their Eggs — Fresh for a Full Year" ──
// claudio yoder · clon del 4.3M (water glassing) · fórmula Elias · voz Claudio clonada (Chatterbox).
// Capas: fondo → clips/componentes (CUES) → avatar PiP (cornerBR quieto) → OVERLAYS.
export const TOTAL_FRAMES_HUEVOS = Math.round(TOTAL_HUEVOS * 30);

export const MainHuevos: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <CinematicWrap grain={0} vignette={0}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
          <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
          {CUES.map((cue) => (
            <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>
              {cue.el(sec(cue.dur))}
            </Sequence>
          ))}
          <AvatarLayer src="huevos_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
