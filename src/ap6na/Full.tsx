// ap6na — video completo: cuadro 0 = miniatura sin texto (si la tarjeta la tiene), sin cold open (Salad sin crédito; el creador: «seguí sin cold open»)
// y después el cuerpo narrado, por minutos. Sin audio acá (la mezcla va aparte).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { END, Minute, S } from "./Shot";
import CFG from "./cfg.json";
export const COLD = S((CFG as any).cold);
const MINS = Math.ceil(END / 60);
export const FULL_FRAMES = COLD + S(END);
export const Full: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {(CFG as any).thumb && <Sequence durationInFrames={1}><Img src={staticFile((CFG as any).thumb)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>}
    <Sequence from={COLD}>
      {Array.from({ length: MINS }).map((_, i) => <Sequence key={i} from={i * 1800} durationInFrames={Math.min(1800 + 900, S(END) - i * 1800)}><Minute n={i + 1} /></Sequence>)}
    </Sequence>
  </AbsoluteFill>
);
