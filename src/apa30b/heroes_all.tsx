// apa30b · registro de los componentes únicos (clave de heroes.json → componente) y el cuadro 0 (la miniatura sin texto).
import React from "react";
import { H } from "./hkit";
import { HTally31, HKitList, HSmoothWall, HLogAxle, HDrillHoles, HSpinTest, HSmear, HRamp, HManyVsOne, HDryWet, HLetGo, HAwayDays } from "./heroes_1";
import { HBaseboard, HSigns, HWallMap, HPreBait, HTapeOff, HBoldOnes, HBedding, HLidGloves, HHanta, HDustAir, HSoak5, HNoSweep } from "./heroes_2";
import { HHouseMouse, HDeerMouse, HBreedMath, HOwlRafters, HDoorGap, HSteelWool, HMetalCans, HClutter, HChalkDays, HLickedClean, HFallFields, HBaitJars, HHourglass, HOneMin, HPencil } from "./heroes_3";
export { Thumb0 } from "./thumb0";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  tally31: HTally31, kitlist: HKitList, smoothwall: HSmoothWall, logaxle: HLogAxle, drillholes: HDrillHoles, spintest: HSpinTest, smear: HSmear, ramp: HRamp,
  manyvsone: HManyVsOne, drywet: HDryWet, letgo: HLetGo, awaydays: HAwayDays,
  baseboard: HBaseboard, signs: HSigns, wallmap: HWallMap, prebait: HPreBait, tapeoff: HTapeOff, boldones: HBoldOnes, bedding: HBedding, lidgloves: HLidGloves,
  hanta: HHanta, dustair: HDustAir, soak5: HSoak5, nosweep: HNoSweep,
  housemouse: HHouseMouse, deermouse: HDeerMouse, breedmath: HBreedMath, owlrafters: HOwlRafters, doorgap: HDoorGap, steelwool: HSteelWool, metalcans: HMetalCans,
  clutter: HClutter, chalkdays: HChalkDays, lickedclean: HLickedClean, fallfields: HFallFields, baitjars: HBaitJars, hourglass: HHourglass, onemin: HOneMin, pencil: HPencil,
};
