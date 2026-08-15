import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_tomatoes.gen";
import { AVATAR_WINDOWS, TOTAL_TOMATOES } from "./avatar_tomatoes.gen";
export const TOTAL_FRAMES_TOMATOES = Math.round(TOTAL_TOMATOES * 30);
export const MainTomatoes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap handheld={0} grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>
        ))}
        <AvatarLayer src="tomatoes_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
