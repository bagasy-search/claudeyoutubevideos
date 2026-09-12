// Main_ohfcardboard.tsx — GENERADO por build_ohfcardboard.mjs. NO editar a mano.
import { AbsoluteFill, Sequence } from "remotion";
import { AvatarLayerOhf } from "../ohfcardboard/AvatarLayerOhf";
import { CUES } from "./cues_ohfcardboard.gen";
import { AVATAR_WINDOWS, TOTAL_FRAMES_OHFCARDBOARD } from "./avatar_ohfcardboard.gen";

const F = (s: number) => Math.round(s * 30);

// El audio máster lo muxea el FARM en el stitch, por eso acá no hay <Audio>. `wav` apunta al de
// 8 kHz: el borde audio-reactivo sólo necesita 16 bandas, y el máster de 139 MB se bajaría entero
// en cada uno de los 60 chunks.
export const MainOhfCardboard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    <AvatarLayerOhf src="ohfcardboard_opt.mp4" wav="ohfcardboard_vis.wav" windows={AVATAR_WINDOWS} accent="#E0A32E" loop muted />

    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export { TOTAL_FRAMES_OHFCARDBOARD };
