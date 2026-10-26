import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { Piloto } from "./Piloto";
import { P1 } from "./P1";
import { P2 } from "./P2";
import { P3 } from "./P3";
import { P4 } from "./P4";
import { P5 } from "./P5";
import { P6 } from "./P6";
import { P7 } from "./P7";
import { Reloj } from "./kit3";

// hilo del video: años de servicio que corren desde el juramento (1:50) hasta el retiro
const ANIOS: [number[], number[]] = [[110, 254, 362, 547, 660, 793, 905], [0, 0.4, 3, 10, 15, 22, 25]];

// Video completo de Soot and Sandals: el piloto (gancho 0-63,6 s) + las partes, todas con tiempo absoluto.
export const COMPLETO_DUR = Math.ceil(940.55 * FPS);
const PARTES: [number, number, React.FC<{ t: number }>][] = [[63.4, 163.7, P1], [163.2, 254.2, P2], [253.4, 362.4, P3], [361.6, 547.6, P4], [546.8, 660.0, P5], [659.2, 793.1, P6], [792.4, 941, P7]];

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
      {t >= 110 && t < 925 && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, (t - 110) * 2, (925 - t) * 2) }}>
          {(() => { const a = interpolate(t, ANIOS[0], ANIOS[1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <Reloj t={t} anio={Math.floor(a)} edad={18 + a} x={1640} y={1035} />; })()}
        </div>
      )}
    </AbsoluteFill>
  );
};
