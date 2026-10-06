// Banco de prueba de los componentes NUEVOS del video de la lavadora (farm, 5 s cada uno) con camas REALES del video.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClWasher3D } from "./ClWasher3D";
import { ClFilterFind, ClDoseCap, ClSmellTest } from "./ClLavadora";

const I = "img/cllavadora/";
export const KITL = (B: (i: number) => string | undefined): [React.FC<any>, any][] => [
  [ClWasher3D, { mode: "peel", labels: { a: "El pliegue" }, bed: I + "b_laundry.jpg" }],
  [ClWasher3D, { mode: "spray", labels: { a: "Rocío adentro", b: "Hace espuma" }, bed: B(0) }],
  [ClWasher3D, { mode: "cycle", bed: I + "b_laundry2.jpg" }],
  [ClWasher3D, { mode: "ajar", labels: { a: "Puerta entreabierta" }, bed: B(1) }],
  [ClWasher3D, { mode: "filter", labels: { a: "El filtro", b: "La bandeja" }, bed: I + "b_laundry.jpg" }],
  [ClFilterFind, { bed: B(2) }],
  [ClDoseCap, { bed: B(3) }],
  [ClSmellTest, { bed: B(4) }],
];
export const ClKitLavadora: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KITL((i) => (beds.length ? beds[i % beds.length] : undefined));
  return <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
};
