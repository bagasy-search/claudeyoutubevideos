// registro de los componentes únicos de rosa29c (clave de heroes.json → componente)
import React from "react";
import { H } from "./hkit";
import { FrostCorn, HorseTrail, Crates, Adobe, NailCloth, Barter, Husk, AshLayer, Prick, ToastChips } from "./hc1";
import { Sprout, ThreeWash, MudOven, BreadWeek, Duck, Curdle, Shatter, Forks7, Rain, HenRetire } from "./hc2";
import { Freeze6, Survivor, OffHeat, Fingers3, Pot3Days, SaltLast, Grater, Shepherd, TamalStack, WaterLine } from "./hc3";
import { CrackShell, LentilSteak, Pail, Mash, Bags8, Crust, Staged, TwoJars, NeverEmpty, Shelf7 } from "./hc4";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  frostcorn: FrostCorn, horsetrail: HorseTrail, crates: Crates, adobe: Adobe, nailcloth: NailCloth, barter: Barter, husk: Husk, ashlayer: AshLayer,
  prick: Prick, toastchips: ToastChips, sprout: Sprout, threewash: ThreeWash, mudoven: MudOven, breadweek: BreadWeek, duck: Duck, curdle: Curdle,
  shatter: Shatter, forks7: Forks7, rain: Rain, henretire: HenRetire, freeze6: Freeze6, survivor: Survivor, offheat: OffHeat, fingers3: Fingers3,
  pot3days: Pot3Days, saltlast: SaltLast, grater: Grater, shepherd: Shepherd, tamalstack: TamalStack, waterline: WaterLine, crackshell: CrackShell,
  lentilsteak: LentilSteak, pail: Pail, mash: Mash, bags8: Bags8, crust: Crust, staged: Staged, twojars: TwoJars, neverempty: NeverEmpty, shelf7: Shelf7,
};
