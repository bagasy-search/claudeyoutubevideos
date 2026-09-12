// Main_mdpros.tsx — GENERADO por build_mdpros.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES } from "./cues_mdpros.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDPROS } from "./avatar_mdpros.gen";

const F = (s: number) => Math.round(s * 30);

// El avatar es el PISO garantizado: REAL en la cabeza (su audio), en BUCLE muteado en la cola.
// `loop` repite el clip de 932 s para cubrir los ~537 s de cola narrados por Fish. `muted` porque
// el audio máster (mdpros_fish.wav) lo muxea el farm en el stitch.
export const MainMdPros: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayer src="mdpros_opt.mp4" wav="mdpros_fish.wav" windows={AVATAR_WINDOWS} accent="#E4322A" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_MDPROS };
