// apa30c · registro de los componentes únicos (clave de heroes.json → componente) y el cuadro 0 (la miniatura sin texto).
import React from "react";
import { H } from "./hkit";
import { HNestSeven, HHoleToFeeder, HHoneyQ, HFeedGauge, HSheepTrail, HDropSize, HGnawCorner, HDaytime, HSlowDays, HSupper, HDuskFeeder, HTreadle, HWeighs, HPropOpen } from "./heroes_1";
import { HEggTwice, HLeakyWater, HChickenWire, HQuarter, HHalfInch, HCornerGap, HTrench, HRatDig, HRaiseCoop, HTwoCousins } from "./heroes_2";
import { HLimbs, HFlashing, HTunnelBox, HBackToBack, HSeedPress, HFourBoxes, HNeverOpen, HFortnight, HSetAll, HCatQ, HPeppermint, HNewHole, HSevenEggs } from "./heroes_3";
export { Thumb0 } from "./thumb0";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  nestseven: HNestSeven, holetofeeder: HHoleToFeeder, honeyq: HHoneyQ, feedgauge: HFeedGauge, sheeptrail: HSheepTrail, dropsize: HDropSize, gnawcorner: HGnawCorner,
  daytime: HDaytime, slowdays: HSlowDays, supper: HSupper, duskfeeder: HDuskFeeder, treadle: HTreadle, weighs: HWeighs, propopen: HPropOpen,
  eggtwice: HEggTwice, leakywater: HLeakyWater, chickenwire: HChickenWire, quarter: HQuarter, halfinch: HHalfInch, cornergap: HCornerGap, trench: HTrench,
  ratdig: HRatDig, raisecoop: HRaiseCoop, twocousins: HTwoCousins,
  limbs: HLimbs, flashing: HFlashing, tunnelbox: HTunnelBox, backtoback: HBackToBack, seedpress: HSeedPress, fourboxes: HFourBoxes, neveropen: HNeverOpen,
  fortnight: HFortnight, setall: HSetAll, catq: HCatQ, peppermint: HPeppermint, newhole: HNewHole, seveneggs: HSevenEggs,
};
