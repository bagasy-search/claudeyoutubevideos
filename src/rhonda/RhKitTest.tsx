// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhcaulk: corte 3D del cordón de silicona (todos los modos) + cúter tachado, la noche, regla de 2 noches, cinta de pintor.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhCaulkSection3D } from "./RhCaulkSection3D";
import { RhKnifeStop, RhOvernight, RhTwoNightRule, RhTapeLine } from "./RhCaulk";

const I = (n: string) => `img/rhcaulk/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhCaulkSection3D, { mode: "spray", labels: { bead: "Runs right off" } }],
  [RhCaulkSection3D, { mode: "strips", labels: { strip: "Wet all night", roots: "Roots fade" } }],
  [RhCaulkSection3D, { mode: "roots", labels: { roots: "Roots inside", bead: "Soft caulk" } }],
  [RhCaulkSection3D, { mode: "under", labels: { under: "Under the caulk", strip: "Can't reach" } }],
  [RhCaulkSection3D, { mode: "gap", labels: { water: "Water behind it" } }],
  [RhCaulkSection3D, { mode: "redo", labels: {} }],
  [RhKnifeStop, { img: I("b_knife") }],
  [RhOvernight, {}],
  [RhTwoNightRule, { a: I("b_night1"), b: I("b_night2"), verdict: "saved" }],
  [RhTwoNightRule, { a: I("b_under1"), b: I("b_under2"), verdict: "replace" }],
  [RhTapeLine, {}],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
