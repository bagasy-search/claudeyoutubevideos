import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { Piloto } from "./Piloto";
import { P1 } from "./P1";
import { P2 } from "./P2";
import { P3 } from "./P3";
import { P4 } from "./P4";
import { P5 } from "./P5";

// Video completo de Soot and Sandals: el piloto (gancho 0-63,6 s) + las partes, todas con tiempo absoluto.
export const COMPLETO_DUR = Math.ceil(940.55 * FPS);
const PARTES: [number, number, React.FC<{ t: number }>][] = [[63.4, 163.7, P1], [163.2, 254.2, P2], [253.4, 362.4, P3], [361.6, 547.6, P4], [546.8, 660.0, P5]];

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      {t < 64 && <Piloto />}
      <AbsoluteFill>
        <CamaraMano intensidad={0.8}>
          {PARTES.map(([a, b, P], i) => (t >= a && t < b ? <P key={i} t={t} /> : null))}
        </CamaraMano>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
