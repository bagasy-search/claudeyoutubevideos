// GENERADO por build_fedvet1.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_fedvet1.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FEDVET1, TOTAL_FRAMES_FEDVET1 } from "./avatar_fedvet1.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFedvet1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F10" }}>
    <AvatarLayerLoopFcs src="fedvet1_opt.mp4" windows={AVATAR_WINDOWS} avatarFrames={AVATAR_FRAMES_FEDVET1} accent="#0F4A42" avatarFocus={{ x: 0.5, y: 0.26 }} />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
    {OVERLAYS.map((o) => (
      <Sequence key={o.key} from={F(o.start)} durationInFrames={Math.max(1, F(o.dur))}>
        {o.el(Math.max(1, F(o.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_FEDVET1 };
