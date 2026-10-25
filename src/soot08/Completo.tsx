import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { PA, A0, A1 } from "./PA";
import { PB, B0, B1 } from "./PB";
import { PC, C0, C1 } from "./PC";
import { PD, D0, D1 } from "./PD";
import { PE, E0, E1 } from "./PE";
import { PF, F0, F1 } from "./PF";
import { PG, G0, G1 } from "./PG";
import { PH, H0, H1 } from "./PH";
import { PI, I0, I1 } from "./PI";

// soot08 · «The Horrors of Working in a Victorian Factory» — un solo mundo, partes con tiempo absoluto.
export const COMPLETO_DUR = Math.ceil(900.6 * FPS);
const PARTES: [number, number, React.FC<{ t: number }>][] = [[A0, A1, PA], [B0, B1, PB], [C0, C1, PC], [D0, D1, PD], [E0, E1, PE], [F0, F1, PF], [G0, G1, PG], [H0, H1, PH], [I0, I1, PI]];

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        {PARTES.map(([a, b, P], i) => (t >= a && t < b ? <P key={i} t={t} /> : null))}
      </CamaraMano>
    </AbsoluteFill>
  );
};
