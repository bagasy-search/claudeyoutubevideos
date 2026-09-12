import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_evapcooler.gen";
import { AVATAR_WINDOWS, TOTAL_EVAPCOOLER } from "./avatar_evapcooler.gen";

// ── "This $12 Amish Trick Drops a Room 20° in the Worst Heat — No AC, No Power" ──
// Amish Off-Grid Claudio · clon on-brand del cooler evaporativo (Jennies 2.3M) · pasivo.
// Capas: fondo → clips/componentes (CUES) → avatar PiP (cornerBR quieto) → OVERLAYS.
export const TOTAL_FRAMES_EVAPCOOLER = Math.round(TOTAL_EVAPCOOLER * 30);

export const MainEvapcooler: React.FC = () => {
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
          <AvatarLayer src="evapcooler_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
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
