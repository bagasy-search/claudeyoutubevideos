// registro de los componentes únicos de rosa29d (clave de heroes.json → componente)
import React from "react";
import { H } from "./hkit";
import { Lunchbox, PlateAway, SpotCans, Shoes7, SugarFold, RootMill, Ledger, ButterSlump, Queue, BagDeflate } from "./hd1";
import { Shave, IceJug, RollUp, Metate, Stretch9, EggThreads, CupSlice, Treasure, Twirl, BinReturn } from "./hd2";
import { Unmold, Soak, Sacks, Magnet, Seesaw, Lantern, Storm, Postcard, Abacus, Globe } from "./hd3";
import { Tap, Battery, Trays, CrossSection, WindowRain, LastLadle, OneCup, Rings, Piggy, Pocket } from "./hd4";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  lunchbox: Lunchbox, plateaway: PlateAway, spotcans: SpotCans, shoes7: Shoes7, sugarfold: SugarFold, rootmill: RootMill, ledger: Ledger, butterslump: ButterSlump,
  queue: Queue, bagdeflate: BagDeflate, shave: Shave, icejug: IceJug, rollup: RollUp, metate: Metate, stretch9: Stretch9, eggthreads: EggThreads,
  cupslice: CupSlice, treasure: Treasure, twirl: Twirl, binreturn: BinReturn, unmold: Unmold, soak: Soak, sacks: Sacks, magnet: Magnet,
  seesaw: Seesaw, lantern: Lantern, storm: Storm, postcard: Postcard, abacus: Abacus, globe: Globe, tap: Tap, battery: Battery,
  trays: Trays, crosssection: CrossSection, windowrain: WindowRain, lastladle: LastLadle, onecup: OneCup, rings: Rings, piggy: Piggy, pocket: Pocket,
};
