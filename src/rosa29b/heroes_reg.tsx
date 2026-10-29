// registro de los componentes únicos de rosa29b (clave de heroes.json → componente)
import React from "react";
import { H } from "./hkit";
import { RadioDial, SpoonRack, SplitFlap, PenKnife, PeelPot, Embers, AppleCup, Rise, SpoonStand, TwoGlass } from "./hb1";
import { Jiggle, PapelPicado, Phone, Merge, Oven4, SpiralPeel, ThreeBoils, Puff, Hollow, Knob } from "./hb2";
import { Candle, Nest, Ripple, Pumpkin, Colander, Convect, Train, Domino, Caramel, Wave } from "./hb3";
import { Swap, Wheel, Receipt, DropAll, Piping, Peels3, HouseWin, YogurtCups, Bundle, OvenDoor } from "./hb4";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  radiodial: RadioDial, spoonrack: SpoonRack, splitflap: SplitFlap, penknife: PenKnife, peelpot: PeelPot, embers: Embers, applecup: AppleCup, rise: Rise,
  spoonstand: SpoonStand, twoglass: TwoGlass, jiggle: Jiggle, papelpicado: PapelPicado, phone: Phone, merge: Merge, oven4: Oven4, spiralpeel: SpiralPeel,
  threeboils: ThreeBoils, puff: Puff, hollow: Hollow, knob: Knob, candle: Candle, nest: Nest, ripple: Ripple, pumpkin: Pumpkin, colander: Colander,
  convect: Convect, train: Train, domino: Domino, caramel: Caramel, wave: Wave, swap: Swap, wheel: Wheel, receipt: Receipt, dropall: DropAll,
  piping: Piping, peels3: Peels3, housewin: HouseWin, yogurtcups: YogurtCups, bundle: Bundle, ovendoor: OvenDoor,
};
