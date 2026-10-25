import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./kit";
import { Mundo, Lejania, Llave, SUELO } from "./mundo";
import { Pueblo, PT } from "./pueblo";
import { Persona } from "./persona";

const K: Llave[] = [[0, 950, 560, 1], [1, 2250, 600, 1.2, 0.5], [2, 3350, 620, 1.1, 0.5], [3, 4800, 600, 1, 0.5], [4, 6620, 560, 1, 0.5], [5, 6620, 600, 1.6, 0.5], [6, 9900, 500, 0.8, 0.5], [7, 11900, 560, 0.9, 0.5], [8, 31500, 560, 0.9, 0.5]];
export const Prueba: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const hora = t > 6.5 ? 2 : t > 5.5 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Mundo t={t} keys={K} horas={[[0, hora], [99, hora]]} lejos={<Lejania hora={hora} />}>
        <Pueblo abreCasa={t > 4.5 ? 1 : 0} />
        <Persona x={PT.bancoVerdugo} y={SUELO - 30} h={300} t={t} seed={3} gorro="verdugo" barba="#3a2414" capa="#2b0a14" ropa={{ tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" }} />
        <Persona x={6560} y={SUELO - 10} h={300} t={t} seed={4} gorro="verdugo" barba="#3a2414" capa="#2b0a14" ropa={{ tunica: "#7a1f3d", tunica2: "#4a0f26", cinto: "#1d1410", piel: "#f2b48a", piel2: "#d98d66", pelo: "#3a2414" }} />
      </Mundo>
    </AbsoluteFill>
  );
};
