// Main_mdtank.tsx — GENERADO por build_mdtank.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS, SFXCUES } from "./cues_mdtank.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDTANK } from "./avatar_mdtank.gen";

const F = (s: number) => Math.round(s * 30);

export const MainMdTank: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {/* el avatar es el FONDO GARANTIZADO: dura el video entero y nunca deja hueco */}
    <AvatarLayer src="mdtank_opt.mp4" windows={AVATAR_WINDOWS} accent="#E4322A" />

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

    {SFXCUES.map((s, i) => (
      <Sequence key={"sfx" + i} from={F(s.start)}>
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_MDTANK };
