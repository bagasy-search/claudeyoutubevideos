// GENERADO por build_favaselina.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerLoopFcs } from "../_fed6/VideoEdit/scenes/AvatarLayerLoopFcs";
import { CUES, OVERLAYS } from "./cues_favaselina.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FAVASELINA, TOTAL_FRAMES_FAVASELINA } from "./avatar_favaselina.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFavaselina: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerLoopFcs src="favaselina_opt.mp4" windows={AVATAR_WINDOWS} avatarFrames={AVATAR_FRAMES_FAVASELINA} accent="#0F4A42" avatarFocus={{ x: 0.5, y: 0.24 }} />

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

export { TOTAL_FRAMES_FAVASELINA };
