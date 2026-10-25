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

// soot12 · «Why Attacking a Sleeping Viking Camp Was a Death Trap». Partes con tiempo absoluto (voz de 921,3 s).
export const COMPLETO_DUR = Math.ceil(922.3 * FPS);
const PARTES: [number, number, React.FC<{ t: number }>][] = [[0, 51.9, P0], [51.56, 187.1, P1], [186.78, 295.4, P2], [295.06, 393.6, P3], [393.39, 484.0, P4], [483.71, 565.6, P5], [565.39, 667.9, P6], [667.71, 780.0, P7], [779.75, 923, P8]];

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.8}>
        {PARTES.map(([a, b, P], i) => (t >= a && t < b ? <P key={i} t={t} /> : null))}
      </CamaraMano>
    </AbsoluteFill>
  );
};
