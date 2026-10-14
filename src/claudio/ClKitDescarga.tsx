// Banco de prueba de los componentes NUEVOS del video 8 (cldescarga), 5 s cada uno. Camas de prueba en public/img/_kt/.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClFlushJet3D, ClRiseOrSpin, ClTankMark, ClTwoDays, ClStickWire } from "./ClDescarga";

const K = "img/_kt/";
export const KITS8: [React.FC<any>, any][] = [
  [ClFlushJet3D, { mode: "weak", rim: "Agujeritos del borde", jet: "Chorro del fondo", bed: K + "b_bathtub.jpg" }],
  [ClFlushJet3D, { mode: "strong", bed: K + "b_counter.jpg" }],
  [ClRiseOrSpin, { hi: 1, bed: K + "b_doorclosed.jpg" }],
  [ClTankMark, { state: "low", bed: K + "b_caulkwall.jpg" }],
  [ClTwoDays, { bed: K + "b_doorclosed.jpg" }],
  [ClStickWire, { bed: K + "b_counter.jpg" }],
];
export const ClKitDescarga: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#fff" }}>{KITS8.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}</AbsoluteFill>;
