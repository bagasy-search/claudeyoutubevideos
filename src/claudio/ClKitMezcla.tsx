// Banco de prueba de los componentes NUEVOS del video 7 (clmezcla), 5 s cada uno. Camas de prueba en public/img/_kt/.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClMixCloud3D } from "./ClMixCloud3D";
import { ClStoreLabel, ClMixLight, ClProtocol, ClLabelLens } from "./ClMezcla";

const K = "img/_kt/";
export const KITS7: [React.FC<any>, any][] = [
  [ClMixCloud3D, { a: "Cloro", b: "Vinagre", kindA: "jug", kindB: "spray", mode: "gas", verdict: "Gas cloro", bed: K + "b_counter.jpg" }],
  [ClMixCloud3D, { a: "Cloro", b: "Agua oxigenada", kindA: "jug", kindB: "brown", mode: "cancel", verdict: "Se anulan", bed: K + "b_bathtub.jpg" }],
  [ClStoreLabel, { hi: 1, bed: K + "b_doorclosed.jpg" }],
  [ClMixLight, { state: "red", text: "Cloro + ácido", sub: "nunca", bed: K + "b_caulkwall.jpg" }],
  [ClMixLight, { state: "green", text: "Oxigenada + bicarbonato", sub: "sí, en el momento", bed: K + "b_counter.jpg" }],
  [ClProtocol, { step: 3, bed: K + "b_doorclosed.jpg" }],
  [ClLabelLens, { bed: K + "b_counter.jpg" }],
];
export const ClKitMezcla: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{KITS7.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
