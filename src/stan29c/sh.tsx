// stan29c · registro de los componentes únicos (heroes.json → k).
import React from "react";
import { H } from "./hkit";
import { HBacklit, HBook, HCrackle, HDunk, HFloat, HPocket, HPot, HShears, HSnow, HSpirit, HSplash, HSpoons, HTrash, HTruck } from "./sh1";
import { HCan, HDrip, HFan, HFoil, HJar, HJoint, HNeon, HOvenLight, HPh, HSwirl, HTub, HVortex, HWife, HWiggle } from "./sh2";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { crackle: HCrackle, float: HFloat, truck: HTruck, dunk: HDunk, book: HBook, shears: HShears, spirit: HSpirit, pot: HPot,
  trash: HTrash, splash: HSplash, spoons: HSpoons, pocket: HPocket, snow: HSnow, backlit: HBacklit, wife: HWife, drip: HDrip, ovenlight: HOvenLight, wiggle: HWiggle, foil: HFoil,
  neon: HNeon, can: HCan, ph: HPh, joint: HJoint, fan: HFan, swirl: HSwirl, jar: HJar, vortex: HVortex, tub: HTub };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
