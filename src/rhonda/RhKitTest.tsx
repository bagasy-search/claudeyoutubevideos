// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhwasher: goma de la puerta en 3D (todos los modos) + filtro de la bomba, termómetro del ciclo, puerta entreabierta, linterna del cajón.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhGasketFold3D } from "./RhGasketFold3D";
import { RhPumpFilter, RhCycleThermo, RhDoorCrack, RhDrawerFlashlight } from "./RhWasher";

const I = (n: string) => `img/rhwasher/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhGasketFold3D, { mode: "fold", labels: { fold: "The fold", water: "Standing water" } }],
  [RhGasketFold3D, { mode: "clean", labels: { fold: "Spray, scrub, wipe" } }],
  [RhGasketFold3D, { mode: "closed", labels: { fold: "Dark, warm, wet" } }],
  [RhGasketFold3D, { mode: "crack", labels: { door: "Open a crack" } }],
  [RhPumpFilter, { img: I("b_filterpanel2"), finds: [{ img: I("f_sock"), label: "a sock" }, { img: I("f_coins"), label: "coins" }, { img: I("f_hairties"), label: "hair ties" }, { img: I("f_lint"), label: "lint and hair" }] }],
  [RhCycleThermo, { bed: I("b_laundryroom") }],
  [RhDoorCrack, {}],
  [RhDrawerFlashlight, { img: I("b_drawerhole") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
