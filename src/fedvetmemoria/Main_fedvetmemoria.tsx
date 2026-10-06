// GENERADO por build_fedvetmemoria.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLoopVet } from "./AvatarLoop";
import { CUES, OVERLAYS } from "./cues_fedvetmemoria.gen";
import { AVATAR_WINDOWS, AVATAR_FRAMES_FEDVETMEMORIA, TOTAL_FRAMES_FEDVETMEMORIA } from "./avatar_fedvetmemoria.gen";

const F = (s: number) => Math.round(s * 30);

export const MainFedvetmemoria: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F10" }}>
    <AvatarLoopVet src="fedvetmemoria_opt.mp4" windows={AVATAR_WINDOWS} avatarFrames={AVATAR_FRAMES_FEDVETMEMORIA} accent="#0F4A42" avatarFocus={{ x: 0.5, y: 0.26 }} />

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

export { TOTAL_FRAMES_FEDVETMEMORIA };
