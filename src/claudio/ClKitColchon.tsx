// Banco de prueba de los componentes NUEVOS del video 9 (clcolchon), 5 s cada uno. Camas de prueba en public/img/_kt/.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClMattressLayers3D, ClDampSoaked, ClSprayMix, ClDryFan, ClThreeRounds } from "./ClColchon";

const K = "img/_kt/";
export const KITS9: [React.FC<any>, any][] = [
  [ClMattressLayers3D, { mode: "damp", top: "Húmeda, arriba", bed: K + "b_counter.jpg" }],
  [ClMattressLayers3D, { mode: "soaked", inner: "Capas de adentro", bed: K + "b_doorclosed.jpg" }],
  [ClDampSoaked, { hi: 0, bed: K + "b_bathtub.jpg" }],
  [ClSprayMix, { bed: K + "b_counter.jpg" }],
  [ClDryFan, { bed: K + "b_doorclosed.jpg" }],
  [ClThreeRounds, { bed: K + "b_caulkwall.jpg" }],
];
export const ClKitColchon: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{KITS9.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
