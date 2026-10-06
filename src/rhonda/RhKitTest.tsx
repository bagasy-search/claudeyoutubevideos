// Banco de prueba del kit Rhonda en el FARM (antes del render completo): cada componente 5 s con props y assets REALES del video en curso.
// rhtoiletring: corte 3D de la taza (todos los modos) + pasta, nivel de agua, pómez mojada/seca, agua dura, colores del anillo.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RhBowlSection3D } from "./RhBowlSection3D";
import { RhPasteMix, RhWaterLevel, RhPumiceWetDry, RhHardWater, RhRingColors } from "./RhRing";

const B = (n: string) => `broll/rhtoiletring_st/${n}.mp4#270`;
const I = (n: string) => `img/rhtoiletring/${n}.jpg`;
export const KIT: [React.FC<any>, any][] = [
  [RhBowlSection3D, { mode: "grow", labels: { crust: "A layer a day", water: "Water line" } }],
  [RhBowlSection3D, { mode: "layers", labels: { crust: "The anchor", film: "The tenant" } }],
  [RhBowlSection3D, { mode: "paste", labels: { film: "The slime lifts" } }],
  [RhBowlSection3D, { mode: "pumice", labels: { stone: "Wet stone", crust: "The rock" } }],
  [RhBowlSection3D, { mode: "dry", labels: { glaze: "Glaze: scratched", stone: "Dry stone" } }],
  [RhBowlSection3D, { mode: "glaze", labels: {} }],
  [RhPasteMix, { bed: B("bd_showerclean") }],
  [RhWaterLevel, { img: I("b_bathwide") }],
  [RhPumiceWetDry, {}],
  [RhHardWater, { imgs: [I("b_hwfaucet"), I("b_hwglass"), I("b_hwkettle")], labels: ["crusty faucet", "spotty glasses", "kettle scale"] }],
  [RhRingColors, { pick: -1 }],
  [RhRingColors, { pick: 2, bed: B("bd_tilewall") }],
];
export const RhKitTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    {KIT.map(([C, p], i) => (<Sequence key={i} from={i * 150} durationInFrames={150}><C {...p} /></Sequence>))}
  </AbsoluteFill>
);
