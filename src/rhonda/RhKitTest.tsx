// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhmattress: colchón 3D en corte (capas / empapado / rociado), húmedo-no-mojado, secado, prueba de esquina, botella que se infla.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhMattress3D, RhDampMeter, RhDryTimer, RhCornerTest, RhPressureBottle } from "./RhMattress";

const I = (n: string) => `img/rhgrout/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhMattress3D, { mode: "layers", bed: I("r_satisfied") }],
  [RhMattress3D, { mode: "soak", bed: I("r_satisfied") }],
  [RhMattress3D, { mode: "mist", bed: I("r_satisfied") }],
  [RhDampMeter, { bed: I("r_explain") }],
  [RhDampMeter, { bed: I("r_explain"), over: true }],
  [RhDryTimer, { bed: I("r_shrug") }],
  [RhCornerTest, { bed: I("r_coffee") }],
  [RhCornerTest, { bed: I("r_coffee"), fabric: "color" }],
  [RhPressureBottle, { bed: I("r_explain") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
