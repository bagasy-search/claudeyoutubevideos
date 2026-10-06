// Banco de prueba de los componentes NUEVOS del video de las bandejas (farm, 5 s cada uno) con camas REALES del video.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClTray3D } from "./ClTray3D";
import { ClPasteCheck, ClCoating, ClTally, ClReceipt } from "./ClBandeja";

const I = "img/clbandeja/";
export const KITB = (B: (i: number) => string | undefined): [React.FC<any>, any][] => [
  [ClTray3D, { mode: "layers", count: 100, labels: { a: "Una capa por horneada" }, bed: I + "b_kitchen.jpg" }],
  [ClTray3D, { mode: "detergent", labels: { a: "Le pasa por encima" }, bed: B(0) }],
  [ClTray3D, { mode: "paste", labels: { a: "Burbujas por debajo" }, bed: I + "b_kitchen2.jpg" }],
  [ClTray3D, { mode: "flake", labels: { a: "Escamas" }, bed: B(1) }],
  [ClPasteCheck, { bed: I + "b_counter.jpg" }],
  [ClCoating, { bed: B(2) }],
  [ClTally, { total: 30, lost: 2, bed: B(3) }],
  [ClReceipt, { bed: B(4) }],
];
export const ClKitBandeja: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KITB((i) => (beds.length ? beds[i % beds.length] : undefined));
  return <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
};
