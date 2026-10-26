import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { P0 } from "./P0";
import { P1 } from "./P1";
import { P2 } from "./P2";
import { P3 } from "./P3";
import { P4 } from "./P4";
import { P5 } from "./P5";
import { P6 } from "./P6";
import { P7 } from "./P7";
import { P8 } from "./P8";
import { Mini } from "./Mini";
import { Primer } from "./primer";

// Video completo de soot09 (Jamestown): un solo mundo continuo, partes con tiempo absoluto.
export const SOOT09_DUR = Math.ceil(908.6 * FPS);
const PARTES: [number, number, React.FC<{ t: number }>][] = [[0, 52.2, P0], [52.2, 138.6, P1], [138.6, 213.72, P2], [213.72, 342.72, P3], [342.72, 439.32, P4], [439.32, 550.63, P5], [550.63, 649.69, P6], [649.69, 741.13, P7], [741.13, 908.6, P8]];

export const Soot09: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        {PARTES.map(([a, b, P], i) => (t >= a && t < b ? <P key={i} t={t} /> : null))}
        <Primer t={t} />
      </CamaraMano>
      <Mini t={t} />
    </AbsoluteFill>
  );
};
