// tdp29a · mapa clave → componente (las claves salen de spec_tdp29a.py)
import React from "react";
import { HBook, HBothSides, HDoors, HDoubled, HHouse, HHundred, HKnock, HMeiwaku, HNotThis, HTrayChip, HTrays } from "./heroes_a1";
import { HBakery, HCoffee, HFridge, HLockdown, HMonths, HParents, HSteps, HSuits, HSurvey, HTrain } from "./heroes_a2";
import { HArigato, HDayCycle, HGlobe, HLetter, HNotebook, HOpposite, HRoof, HSlide, HTrust, HWalls, HWindows } from "./heroes_a3";
export const HC: Record<string, React.FC<any>> = {
  trays: HTrays, doors: HDoors, notthis: HNotThis, house: HHouse, knock: HKnock, traychip: HTrayChip, hundred: HHundred, book: HBook, doubled: HDoubled,
  meiwaku: HMeiwaku, bothsides: HBothSides, suits: HSuits, train: HTrain, steps: HSteps, parents: HParents, months: HMonths, survey: HSurvey,
  lockdown: HLockdown, coffee: HCoffee, bakery: HBakery, notebook: HNotebook, walls: HWalls, fridge: HFridge, trust: HTrust, daycycle: HDayCycle,
  roof: HRoof, globe: HGlobe, letter: HLetter, slide: HSlide, opposite: HOpposite, arigato: HArigato, windows: HWindows,
};
