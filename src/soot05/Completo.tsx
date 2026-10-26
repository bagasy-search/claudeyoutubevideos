import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { C, FPS } from "./kit";
import { Plano, Eventos, Factura, Camino, Pose } from "./motor";
import { K, A, O, W, F, TT } from "./base";
import { acomodar } from "./acomoda";
import { X0, P0 } from "./d0";
import { X1, P1 } from "./d1";
import { X2, P2 } from "./d2";
import { X3, P3 } from "./d3";
import { X4, P4 } from "./d4";
import { Portada } from "./portada";
import { Golpes } from "./golpe";

// soot05 «Why Medieval Prisons Were Worse Than Death»: un solo plano por un mundo continuo (ver mundo.tsx).
export const COMPLETO_DUR = Math.ceil(917.6 * FPS);
K.sort((a, b) => a[0] - b[0]);
// cuándo se ve la factura (arriba a la derecha) y el camino de trampas (abajo)
const FV: [number, number][] = [[9.7, 45.8], [49.0, 1e9]];
const CV: [number, number][] = [[49.8, 1e9]];
acomodar(O, W, K, A, FV, 49.8);
const XM = [X0, X1, X2, X3, X4];
const XP = [P0, P1, P2, P3, P4];

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.noche }}>
      <CamaraMano intensidad={0.7}>
        <Plano t={t} K={K} A={A} W={W} extraMundo={(c: Pose) => <>{XM.map((f, i) => <React.Fragment key={i}>{f(t, c)}</React.Fragment>)}</>} />
        <Portada t={t} />
        <Eventos t={t} E={O} />
        {XP.map((f, i) => <React.Fragment key={i}>{f(t)}</React.Fragment>)}
        <Golpes t={t} />
        <Factura t={t} F={F} visible={FV} />
        <Camino t={t} T={TT} visible={CV} />
      </CamaraMano>
    </AbsoluteFill>
  );
};
