import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { V } from "../cmeduelo/VoltStage";
import { CUES, OVERLAYS } from "./cues_cmeduelo.gen";
import { AVATAR_WINDOWS, TOTAL_CMEDUELO } from "./avatar_cmeduelo.gen";

// "Panel Solar de $50 vs Turbina Eólica de $50 en un Patio Normal" — canal Claudio Mendoza Constructor.
// Micro-momento por micro-momento (250) + 6 MOVIMIENTOS premium + los micro-efectos del kit VOLT.
export const TOTAL_FRAMES_CMEDUELO = Math.round(TOTAL_CMEDUELO * 30);

export const MainCmeduelo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
        <AvatarLayer src="cmeduelo_opt.mp4" windows={AVATAR_WINDOWS} accent={V.volt} />
        {CUES.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
            {cue.el(Math.max(1, sec(cue.dur)))}
          </Sequence>
        ))}
        {OVERLAYS.map((cue) => (
          <Sequence key={cue.key} from={sec(cue.start)} durationInFrames={Math.max(1, sec(cue.dur))}>
            {cue.el(Math.max(1, sec(cue.dur)))}
          </Sequence>
        ))}
      </AbsoluteFill>
    </CinematicWrap>
  </AbsoluteFill>
);
