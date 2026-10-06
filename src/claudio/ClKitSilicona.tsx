// Banco de prueba de los componentes NUEVOS del video de la silicona (farm, 5 s cada uno) + el ClTray3D corregido de las bandejas.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClCaulk3D } from "./ClCaulk3D";
import { ClFilmWrap, ClTubMap, ClCaulkGun } from "./ClSilicona";
import { ClTray3D } from "./ClTray3D";

const I = "img/clsilicona/";
export const KITS2 = (B: (i: number) => string | undefined): [React.FC<any>, any][] => [
  [ClCaulk3D, { mode: "inside", labels: { a: "Adentro de la silicona" }, bed: I + "b_bathtub.jpg" }],
  [ClCaulk3D, { mode: "spray", labels: { a: "Chorrea", b: "El moho, igual" }, bed: B(0) }],
  [ClCaulk3D, { mode: "strips", labels: { a: "La humedad entra", b: "Toda la noche" }, bed: I + "b_bathtub2.jpg" }],
  [ClCaulk3D, { mode: "seal", labels: { a: "La unión mojada", b: "Encerrado" }, bed: B(1) }],
  [ClFilmWrap, { n: 6, bed: I + "b_counter.jpg" }],
  [ClTubMap, { bed: B(2) }],
  [ClCaulkGun, { bed: B(3) }],
  [ClTray3D, { mode: "layers", count: 100, labels: { a: "Una capa por horneada" }, bed: B(4) }],
  [ClTray3D, { mode: "flake", labels: { a: "Escamas" }, bed: B(0) }],
];
export const ClKitSilicona: React.FC<{ beds?: string[] }> = ({ beds = [] }) => {
  const K = KITS2((i) => (beds.length ? beds[i % beds.length] : undefined));
  return <AbsoluteFill style={{ backgroundColor: "#fff" }}>{K.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
};
