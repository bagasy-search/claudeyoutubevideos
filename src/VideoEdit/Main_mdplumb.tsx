// Main_mdplumb.tsx — GENERADO por build_mdplumb.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayer } from "./scenes/AvatarLayer";
import { CUES } from "./cues_mdplumb.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_MDPLUMB } from "./avatar_mdplumb.gen";

const F = (s: number) => Math.round(s * 30);

// El avatar es el PISO garantizado: REAL en la cabeza (su audio), en BUCLE muteado en la cola.
// `loop` repite el avatar de 458 s para cubrir los ~1860 s del máster. `muted` porque
// el audio máster (mdplumb_fish.wav) lo muxea el farm en el stitch.
export const MainMdPlumb: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayer src="mdplumb_opt.mp4" wav="mdplumb.wav" windows={AVATAR_WINDOWS} accent="#E4322A" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_MDPLUMB };
