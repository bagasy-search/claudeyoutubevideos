import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CinematicWrap } from "./components/CinematicWrap";
import { V } from "../cmebateria/VoltStage";
import { CUES, OVERLAYS } from "./cues_cmebateria.gen";
import { AVATAR_WINDOWS, TOTAL_CMEBATERIA } from "./avatar_cmebateria.gen";

// "¿Esta Batería de Auto Puede Reemplazar al Generador a Nafta en un Apagón?" — Claudio Mendoza Constructor.
// Micro-momento por micro-momento (220) + 7 MOVIMIENTOS premium + los micro-efectos del kit VOLT.
export const TOTAL_FRAMES_CMEBATERIA = Math.round(TOTAL_CMEBATERIA * 30);

export const MainCmebateria: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
    <CinematicWrap grain={0} vignette={0}>
      <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
        <AvatarLayer src="cmebateria_opt.mp4" windows={AVATAR_WINDOWS} accent={V.volt} />
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
