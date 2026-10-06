// Banco de prueba de los componentes NUEVOS del video del moho (farm, 5 s cada uno) con camas REALES del video.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClPores3D } from "./ClPores3D";
import { ClSwab, ClSpores, ClFlashlight, ClWallLeak, ClHygrometer } from "./ClMoho";

const I = "img/clmoho/";
export const KITM = (B: (i: number) => string | undefined): [React.FC<any>, any][] => [
  [ClPores3D, { mode: "roots", labels: { top: "Lo que se ve", roots: "Las raíces" }, bed: I + "b_shower.jpg" }],
  [ClPores3D, { mode: "bleach", labels: { top: "Se pone blanco", roots: "Abajo sigue vivo" }, bed: B(0) }],
  [ClPores3D, { mode: "peroxide", labels: { liquid: "Baja por los poros", roots: "Las raíces" }, bed: I + "b_shower.jpg" }],
  [ClPores3D, { mode: "spores", labels: { top: "En seco, vuela" }, bed: B(1) }],
  [ClSwab, { bed: B(2) }],
  [ClSpores, { img: I + "b_showerwide.jpg" }],
  [ClFlashlight, { img: I + "b_grouttile.jpg" }],
  [ClWallLeak, { bed: B(3) }],
  [ClHygrometer, { bed: B(4) }],
];
export const ClKitMoho: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KITM((i) => (beds.length ? beds[i % beds.length] : undefined));
  return <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
};
