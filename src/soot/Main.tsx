import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { at, suave } from "./lib";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { Mapa, Parada, Contrato } from "./M00";
import { Camino } from "./comun";
import { Granja, Foro, Egipto } from "./T1";
import { Campo, Rio, Ruta, Josefo } from "./T2";
import { Taller, Desierto, Campamento, Carpa, Muralla } from "./T3";
import { Cuartel, Danubio, Guardia, Planilla, Vindolanda, Fortaleza } from "./T4";
import { Letrina, Peste, Hospital, Granero } from "./T5";
import { Colina, Cannas, Bosque } from "./T6";
import { Colonia, Pantano, Tumbas } from "./T7";
import { Giro, Ciudad, Cierre } from "./FIN";

export const FPS = 30;
export const VOZ = 940.55;
export const DUR = Math.ceil((VOZ + 0.55) * FPS); // la mezcla lleva 1 s de silencio final

type Esc = { t0: number; C: React.FC<{ t: number; t0: number }> };
const sinT0 = (C: React.FC<{ t: number }>): React.FC<{ t: number; t0: number }> => ({ t }) => <C t={t} />;
const camino = (n: number, tTrap: number): React.FC<{ t: number; t0: number }> => ({ t }) => <Camino t={t} n={n} t0={tTrap} />;

// cada corte cae ~0,08 s antes de la palabra que abre la frase nueva
const C = 0.08;
const ESC: Esc[] = [
  { t0: 0, C: sinT0(Mapa) },
  { t0: 4.06 - C, C: sinT0(Parada) },
  { t0: at("read the contract") + 0.4, C: sinT0(Contrato) },
  { t0: at("roughly half") - 0.05, C: sinT0(Parada) },
  { t0: 39.22 - C, C: camino(0, 39.22 - C) },
  { t0: 53.56 - C, C: Granja },
  { t0: 63.48 - C, C: Foro },
  { t0: 135.16 - C, C: Egipto },
  { t0: 163.26 - C, C: camino(2, 163.26) },
  { t0: 165.6, C: Campo },
  { t0: 185.14 - C, C: Rio },
  { t0: 200.56 - C, C: Ruta },
  { t0: 231.2 - C, C: Josefo },
  { t0: 253.76 - C, C: camino(3, 253.76) },
  { t0: 256.14 - C, C: Taller },
  { t0: 292.38 - C, C: Desierto },
  { t0: 306.78 - C, C: Campamento },
  { t0: 328.94 - C, C: Carpa },
  { t0: 336.88 - C, C: Muralla },
  { t0: 361.98 - C, C: camino(4, 361.98) },
  { t0: 364.26 - C, C: Cuartel },
  { t0: 393.18 - C, C: Danubio },
  { t0: 415.36 - C, C: Guardia },
  { t0: 454.3 - C, C: Planilla },
  { t0: 502.48 - C, C: Vindolanda },
  { t0: 537.41 - C, C: Fortaleza },
  { t0: 547.17 - C, C: camino(5, 547.17) },
  { t0: 549.51 - C, C: Letrina },
  { t0: 585.1 - C, C: Peste },
  { t0: 610.79 - C, C: Hospital },
  { t0: 636.1 - C, C: Granero },
  { t0: 659.62 - C, C: camino(6, 659.62) },
  { t0: 662.0 - C, C: Colina },
  { t0: 706.03 - C, C: Cannas },
  { t0: 734.83 - C, C: Bosque },
  { t0: 792.73 - C, C: camino(7, 792.73) },
  { t0: 795.15 - C, C: Colonia },
  { t0: 825.69 - C, C: Pantano },
  { t0: 845.35 - C, C: Tumbas },
  { t0: 884.49 - C, C: Giro },
  { t0: 911.89 - C, C: Ciudad },
  { t0: 928.77 - C, C: Cierre },
];

export const Soot: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let i = 0;
  for (let k = 0; k < ESC.length; k++) if (t >= ESC[k].t0) i = k;
  const { C: Escena, t0 } = ESC[i];
  // fundido a negro sólo al final del video
  const fin = 1 - suave(t, DUR / FPS - 1.2, DUR / FPS - 0.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        <CamaraMano intensidad={0.9} seed={11}>
          <Escena t={t} t0={t0} />
        </CamaraMano>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
