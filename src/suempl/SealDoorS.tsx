// suempl · sello de puerta con empuje CAPADO a 1,08 y sello completo dentro del cuadro (R6).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../repkit/Rk";
import { Stamp } from "../repkit/Kit";

type Props = { bg: string; from: number; dur: number; tStamp: number; tPush: number };
const ez = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2; };
const cl = (x: number) => Math.max(0, Math.min(1, x));

export const SealDoorS: React.FC<Props> = ({ bg, from, tStamp, tPush }) => {
  const f = useCurrentFrame(); // local al Sequence de Full (desde from)
  const now = from + f / 30;
  const push = cl((now - tPush) / 2.5);
  const s = 1 + 0.08 * ez(push); // tope 1,08
  const st = (now - tStamp) * 30;
  const u = cl(st / 8);
  const land = 1.0 + 0.2 * (1 - u); // cae a tamaño final 1,0 (sello 96 px)
  const rot = -6 + 4 * u;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4))" }} />
        {st >= 0 ? (
          <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${land})`, opacity: cl(st / 4), filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.5))" }}>
            <Stamp label={"DETRÁS DE LA\nGÓNDOLA"} size={96} />
          </div>
        ) : null}
      </AbsoluteFill>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};
