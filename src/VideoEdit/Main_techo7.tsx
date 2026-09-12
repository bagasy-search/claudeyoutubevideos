import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_techo7.gen";
import { AVATAR_WINDOWS, TOTAL_TECHO7 } from "./avatar_techo7.gen";
export const TOTAL_FRAMES_TECHO7 = Math.round(TOTAL_TECHO7 * 30);
export const MainTecho7: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
        {CUES.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>))}
        <AvatarLayer src="techo7_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        {OVERLAYS.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
