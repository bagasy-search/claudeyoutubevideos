import { AbsoluteFill, Sequence } from "remotion";
import { sec, COLORS } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { CUES, OVERLAYS } from "./cues_vj7hqe8koadv.gen";
import { AVATAR_WINDOWS, TOTAL_VJ7HQE8KOADV } from "./avatar_vj7hqe8koadv.gen";
export const TOTAL_FRAMES_VJ7HQE8KOADV = Math.round(TOTAL_VJ7HQE8KOADV * 30);
export const MainVj7hqe8koadv: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="amber" drift={0.4} />
        {CUES.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>))}
        <AvatarLayer src="vj7hqe8koadv_opt.mp4" windows={AVATAR_WINDOWS} accent={COLORS.accent} />
        {OVERLAYS.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={sec(cue.dur)}>{cue.el(sec(cue.dur))}</Sequence>))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
