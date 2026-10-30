// tdp29c · mapa clave → componente (las claves salen de spec_tdp29c.py)
import React from "react";
import { HBanjiha, HBuilding, HCalendar, HCounter, HGoshiwon, HNeon, HParking, HRising } from "./heroes_c1";
import { HDiorama, HFast, HLaw, HNoHelp, HNotes, HPlug, HScreen, HThird, HYounger } from "./heroes_c2";
import { HCafe, HCorner, HDay, HJeong, HKnock, HMaeul, HMilk, HNineDays, HTable, HTowers, HTwoCoffees, HUnclaimed, HYogurt } from "./heroes_c3";
export const HC: Record<string, React.FC<any>> = {
  neon: HNeon, counter: HCounter, building: HBuilding, calendar: HCalendar, rising: HRising, goshiwon: HGoshiwon, parking: HParking, banjiha: HBanjiha,
  fast: HFast, nohelp: HNoHelp, notes: HNotes, diorama: HDiorama, law: HLaw, plug: HPlug, screen: HScreen, third: HThird, younger: HYounger,
  ninedays: HNineDays, day: HDay, maeul: HMaeul, jeong: HJeong, towers: HTowers, table: HTable, unclaimed: HUnclaimed, yogurt: HYogurt,
  milk: HMilk, cafe: HCafe, corner: HCorner, knock: HKnock, twocoffees: HTwoCoffees,
};
