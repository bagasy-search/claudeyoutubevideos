// GENERADO por build_mdgutter.mjs. NO editar a mano.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CUES } from "./cues_mdgutter.gen";

const F = (s: number) => Math.round(s * 30);
export const TOTAL_FRAMES_MDGUTTER = 45224;

export const MainMdGutter: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0A0C" }}>
    {CUES.map((cue) => (
      <Sequence key={cue.key} from={F(cue.start)} durationInFrames={Math.max(1, F(cue.dur))}>
        {cue.el(Math.max(1, F(cue.dur)))}
      </Sequence>
    ))}
    <Audio src={staticFile("mdgutter.m4a")} />
  </AbsoluteFill>
);
