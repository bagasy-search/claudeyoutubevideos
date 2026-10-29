// registro de los componentes únicos de rosa29a (clave de heroes.json → componente)
import React from "react";
import { H } from "./hkit";
import { Clock, Calendar, SevenCups, Deck, Lockbox, Coins, Ruler, Flip, EggDial, Bowls, River, Rest } from "./hr1";
import { Ripe, Pour, CutGrid, Wrap, Drops, Trio, BrothJar, Wardrobe, PlusTwo, Moon, Thermo, BreadBack, Sunday } from "./hr2";
import { Table1, Salt, Stir, Spoon, Work, Flower, Measure } from "./hr4";
import { Jars3, Cutter, Fridge, PriceTag, Split, Compass, Crate, BoxBag, Letters, Skillet, Lid, Plates3 } from "./hr3";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  clock: Clock, calendar: Calendar, sevencups: SevenCups, deck: Deck, lockbox: Lockbox, coins: Coins, ruler: Ruler, flip: Flip, eggdial: EggDial,
  bowls: Bowls, river: River, rest: Rest, ripe: Ripe, pour: Pour, cutgrid: CutGrid, wrap: Wrap, drops: Drops, trio: Trio, brothjar: BrothJar,
  wardrobe: Wardrobe, plustwo: PlusTwo, moon: Moon, thermo: Thermo, breadback: BreadBack, sunday: Sunday, jars3: Jars3, cutter: Cutter, fridge: Fridge,
  pricetag: PriceTag, split: Split, compass: Compass, crate: Crate, boxbag: BoxBag, letters: Letters, skillet: Skillet, lid: Lid, plates3: Plates3,
  table1: Table1, salt: Salt, stir: Stir, spoon: Spoon, work: Work, flower: Flower, measure: Measure,
};
