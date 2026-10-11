// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhmusty: la casa 3D (recorrido + lugar activo), olfatómetro, codo del desagüe (3 modos), rejilla de la heladera, higrómetro.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhHousePlan3D, RhNoseMeter, RhDrainTrap, RhFridgeGrille, RhHygrometer } from "./RhMusty";

const I = (n: string) => `img/rhgrout/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhHousePlan3D, { bed: I("r_satisfied") }],
  [RhHousePlan3D, { active: 4, bed: I("r_satisfied"), title: "PLACE 4" }],
  [RhNoseMeter, { bed: I("r_explain") }],
  [RhDrainTrap, { mode: "full", bed: I("r_explain") }],
  [RhDrainTrap, { mode: "dry", bed: I("r_explain") }],
  [RhDrainTrap, { mode: "oil", bed: I("r_explain") }],
  [RhFridgeGrille, { bed: I("r_shrug") }],
  [RhHygrometer, { bed: I("r_coffee") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
