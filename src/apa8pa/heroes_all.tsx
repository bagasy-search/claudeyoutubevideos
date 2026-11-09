// MIO apa8pa · registro de los componentes únicos (clave de heroes.json → componente) y cuadro 0.
import React from "react";
import { H } from "./hkit";
import { HBroomRoad, HRingBare, HThreeThings, HMoleVole, HScissorCut, HCleanHole, HTownGrow, HWaveYears, HAppleTest, HToothMarks } from "./heroes_1";
import { HFlagsMap, HCrawlSpace, HGirdle, HMarchMelt, HHiredHand, HPartsFly, HTwoInchJam, HDoorSize, HPaintStick, HCatArm, HPeaSize } from "./heroes_2";
import { HRebarPin, HSixtyCircle, HMoveStation, HRatPipe, HFreeNights, HChickenWire, HSnowLine, HVolcano, HWideRiver, HCoffeeRail, HFrozenDirt, HBlackSnake, HPerchPost, HGasBack, HBridgeGraft, HBirdRoof, HCleanSlice, HDigKey, HLastNotch, HThreeFootRing, HSnowPacks } from "./heroes_3";
export { Thumb0 } from "./thumb0";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  broomroad: HBroomRoad, ringbare: HRingBare, threethings: HThreeThings, molevole: HMoleVole, scissorcut: HScissorCut, cleanhole: HCleanHole, towngrow: HTownGrow, waveyears: HWaveYears, appletest: HAppleTest, toothmarks: HToothMarks,
  flagsmap: HFlagsMap, crawlspace: HCrawlSpace, girdle: HGirdle, marchmelt: HMarchMelt, hiredhand: HHiredHand, partsfly: HPartsFly, twoinchjam: HTwoInchJam, doorsize: HDoorSize, paintstick: HPaintStick, catarm: HCatArm, peasize: HPeaSize,
  rebarpin: HRebarPin, sixtycircle: HSixtyCircle, movestation: HMoveStation, ratpipe: HRatPipe, freenights: HFreeNights, chickenwire: HChickenWire, snowline: HSnowLine, volcano: HVolcano, widerriver: HWideRiver, coffeerail: HCoffeeRail, frozendirt: HFrozenDirt, blacksnake: HBlackSnake, perchpost: HPerchPost, gasback: HGasBack, bridgegraft: HBridgeGraft, birdroof: HBirdRoof, cleanslice: HCleanSlice, digkey: HDigKey, lastnotch: HLastNotch, threefootring: HThreeFootRing, snowpacks: HSnowPacks,
};
