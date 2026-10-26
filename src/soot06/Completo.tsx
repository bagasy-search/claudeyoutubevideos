import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { FPS } from "./kit";
import { Mundo, Camara, camEn, Llave, CamP } from "./mundo";
import * as G from "./Gancho";
import * as P1 from "./T1";
import * as P2 from "./T2";
import * as P3 from "./T3";
import * as P4 from "./T4";
import * as P5 from "./T5";
import * as P6 from "./T6";
import * as P7 from "./T7";
import * as PF from "./Final";
import { Cuadro0, C0_FIN } from "./Cuadro0";
import { RelojNoche } from "./comun";

// soot06 completo: UN mundo (el castillo en corte) y UNA cámara que viaja toda la noche sin cortar.
// Cada parte aporta sus llaves de cámara, sus actores dentro del mundo y su capa de pantalla (chips, insertos).
export const DUR = 911.6;
export const COMPLETO_DUR = Math.ceil(DUR * FPS);
type Parte = { T0: number; T1: number; CAM: Llave[]; Mundo: React.FC<{ t: number; c: CamP }>; Capa: React.FC<{ t: number; c: CamP }> };
const PARTES: Parte[] = [G, P1, P2, P3, P4, P5, P6, P7, PF];
const CAM: Llave[] = PARTES.flatMap((p) => p.CAM).sort((a, b) => a[0] - b[0]);

const tramo = (t: number, pts: [number, number][]) => interpolate(t, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
// hora del cielo: atardecer → noche (timelapse del gancho y rebobinado) → noche cerrada → amanecer en el giro
export const horaEn = (t: number) => tramo(t, [[0, 0.02], [5.5, 0.02], [9.6, 1], [10.7, 1], [11.5, 0.08], [55, 0.3], [200, 0.85], [281, 1], [813, 1], [828, 1.75], [905, 2]]);
const fuegoEn = (t: number) => tramo(t, [[0, 1], [33.9, 1], [34.15, 1.5], [34.6, 1], [270, 1], [276, 1.15], [400, 1], [406, 0.45], [760, 0.45], [770, 0.3], [789, 0.5], [800, 1.5], [812, 1.3], [818, 0.2], [830, 1]]);
const incendioEn = (t: number) => tramo(t, [[0, 0], [790.5, 0], [797, 0.45], [808, 0.75], [813.5, 0.75], [818, 0]]);
const ascoEn = (t: number) => tramo(t, [[0, 0], [319, 0], [326, 1], [580, 1]]);
const nieveEn = (t: number) => tramo(t, [[0, 0.5], [12, 0.3], [20, 0], [380, 0], [386, 0.8], [405, 0.8], [413, 0]]);
const postigosEn = (t: number) => tramo(t, [[0, 0], [387.5, 0], [388.2, 1], [395, 1], [396, 0]]);

export const Completo: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = camEn(t, CAM);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0a2a" }}>
      <CamaraMano intensidad={interpolate(t, [0, C0_FIN], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <Camara c={c}>
          <Mundo t={t} c={c} hora={horaEn(t)} fuego={fuegoEn(t)} incendio={incendioEn(t)} asco={ascoEn(t)} nieve={nieveEn(t)} postigos={postigosEn(t)} />
          {PARTES.map((p, i) => (t >= p.T0 - 1.5 && t < p.T1 + 1.5 ? <p.Mundo key={i} t={t} c={c} /> : null))}
        </Camara>
        {t < C0_FIN && <Cuadro0 t={t} />}
        {PARTES.map((p, i) => (t >= p.T0 - 1.5 && t < p.T1 + 1.5 ? <p.Capa key={i} t={t} c={c} /> : null))}
      </CamaraMano>
      <RelojNoche t={t} />
    </AbsoluteFill>
  );
};
