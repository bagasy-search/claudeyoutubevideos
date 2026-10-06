// Main_ohfflies.tsx — GENERADO por build_ohfflies.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerOhf } from "../ohfflies/AvatarLayerOhf";
import { CUES } from "./cues_ohfflies.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_OHFFLIES } from "./avatar_ohfflies.gen";

const F = (s: number) => Math.round(s * 30);

// El audio máster lo muxea el FARM en el stitch, por eso acá no hay <Audio>. `wav` apunta al de
// 8 kHz: el borde audio-reactivo sólo necesita 16 bandas, y el máster no se baja entero en cada chunk.
export const MainOhfFlies: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerOhf src="ohfflies_opt.mp4" wav="ohfflies_vis.wav" windows={AVATAR_WINDOWS} accent="#E0A32E" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OHFFLIES };
