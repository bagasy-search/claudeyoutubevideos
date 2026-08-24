import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { TechBackground } from "./components/TechBackground";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { THEME_VOLT } from "./kit/premium";
import { CUES, OVERLAYS } from "./cues_cme3.gen";
import { AVATAR_WINDOWS, TOTAL_CME3 } from "./avatar_cme3.gen";
export const TOTAL_FRAMES_CME3 = Math.round(TOTAL_CME3 * 30);
export const MainCme3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: THEME_VOLT.color.bg0 }}>
        <TechBackground glowX={50} glowY={46} hue="cold" drift={0.4} />
        {CUES.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>{cue.el(sec(cue.dur))}</Sequence>))}
        <AvatarLayer src="cme3_opt.mp4" windows={AVATAR_WINDOWS} accent="#C8F000" />
        {OVERLAYS.map((cue) => (<Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>{cue.el(sec(cue.dur))}</Sequence>))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
