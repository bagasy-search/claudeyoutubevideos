import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES } from "./cues_meatyears.gen";
import { AVATAR_WINDOWS, TOTAL_MEATYEARS } from "./avatar_meatyears.gen";
export const TOTAL_FRAMES_MEATYEARS = Math.round(TOTAL_MEATYEARS * 30);
export const MainMeatyears: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap handheld={0} grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>
        ))}
        <AvatarLayer src="meatyears_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
