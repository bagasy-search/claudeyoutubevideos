// apa30a · registro de los componentes únicos (clave de heroes.json → componente) y el cuadro 0 (la miniatura sin texto).
import React from "react";
import { H } from "./hkit";
import { HCanBoard, HRidgesDead, HButter, HVelvet, HStarNose, HNotRodent, HWormWeight, HHalfMoon, HStomp, HEdgeRoad, HTubeTrap, HCanMeasure } from "./heroes_1";
import { HFlushRim, HBoardThree, HCheckClock, HBypass, HSmellHands, HFiveTags, HComment20, HPoisonChain, HHoseFlood, HBuzzStake, HCastorTrial, HCallFirst } from "./heroes_2";
import { HFewMiles, HCastorJug, HPushOut, HMeshL, HWaterDeep, HCalendar, HSameMorning, HAirPipe, HFenceDeal, HBycatch, HSeasons, HNeighbor, HAlmanacPage, HShelf } from "./heroes_3";
export { Thumb0 } from "./thumb0";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  canboard: HCanBoard, ridgesdead: HRidgesDead, butter: HButter, velvet: HVelvet, starnose: HStarNose, notrodent: HNotRodent, wormweight: HWormWeight,
  halfmoon: HHalfMoon, stomp: HStomp, edgeroad: HEdgeRoad, tubetrap: HTubeTrap, canmeasure: HCanMeasure,
  flushrim: HFlushRim, boardthree: HBoardThree, checkclock: HCheckClock, bypass: HBypass, smellhands: HSmellHands, fivetags: HFiveTags, comment20: HComment20,
  poisonchain: HPoisonChain, hoseflood: HHoseFlood, buzzstake: HBuzzStake, castortrial: HCastorTrial, callfirst: HCallFirst,
  fewmiles: HFewMiles, castorjug: HCastorJug, pushout: HPushOut, meshl: HMeshL, waterdeep: HWaterDeep, calendar: HCalendar, samemorning: HSameMorning,
  airpipe: HAirPipe, fencedeal: HFenceDeal, bycatch: HBycatch, seasons: HSeasons, neighbor: HNeighbor, almanacpage: HAlmanacPage, shelf: HShelf,
};
