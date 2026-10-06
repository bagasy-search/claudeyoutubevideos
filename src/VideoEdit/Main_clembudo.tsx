// GENERADO por build_clembudo.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES, OVERLAYS, SFXCUES } from "./cues_clembudo.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_CLEMBUDO } from "./avatar_clembudo.gen";

const F = (s: number) => Math.round(s * 30);

export const MainClEmbudo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1C1812" }}>
    {/* el avatar es el FONDO GARANTIZADO: dura el video entero y nunca deja hueco */}
    <AvatarLayer src="clembudo_opt.mp4" windows={AVATAR_WINDOWS as any} accent="#7C8A5A" />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}

    {/* el CTA va ACÁ, en la capa de overlay — nunca adentro de un componente de escena */}
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

export { TOTAL_FRAMES_CLEMBUDO };
