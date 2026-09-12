// Main_mdrt.tsx — GENERADO por build_mdrt.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_mdrt.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDRT, AVATAR_FRAMES_MDRT } from "./avatar_mdrt.gen";

const F = (s: number) => Math.round(s * 30);

export const MainMdRt: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerLoopFcs src="mdrt_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" avatarFrames={AVATAR_FRAMES_MDRT} />
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
    <Audio src={staticFile("mdrt.wav")} />
  </AbsoluteFill>
);
export { TOTAL_FRAMES_MDRT };
