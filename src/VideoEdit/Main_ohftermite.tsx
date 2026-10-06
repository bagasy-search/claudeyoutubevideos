// Main_ohftermite.tsx — GENERADO por build_ohftermite.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES } from "./cues_ohftermite.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_OHFTERMITE } from "./avatar_ohftermite.gen";

const F = (s: number) => Math.round(s * 30);

// El avatar es el PISO garantizado: REAL en la cabeza (8:11, su propio lipsync) y en BUCLE MUTEADO
// en la cola, que la locuta Fish con su voz clonada. El audio máster lo muxea el farm en el stitch,
// por eso acá no hay <Audio>. `wav` apunta al de 8 kHz: el borde audio-reactivo sólo necesita 16
// bandas y el máster de 100 MB se bajaría en cada uno de los 60 chunks.
export const MainOhfTermite: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayer src="ohftermite_opt.mp4" wav="ohftermite_vis.wav" windows={AVATAR_WINDOWS} accent="#E0A32E" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OHFTERMITE };
