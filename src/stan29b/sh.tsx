// stan29b · registro de los componentes únicos (heroes.json → k).
import React from "react";
import { H } from "./hkit";
import { HButter, HChalk, HDimple, HFrost, HHoles, HHopper, HLace, HMelt, HMercury, HPie, HPulse, HShelf, HTimecard, HWilt } from "./sh1";
import { HBun, HCubes, HDome, HFade, HFlatBag, HGrates, HMix, HMorph, HOnion, HPaperBag, HPinch, HSizzle, HSmash, HSpike, HSwatch } from "./sh2";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { lace: HLace, shelf: HShelf, melt: HMelt, pie: HPie, hopper: HHopper, chalk: HChalk, wilt: HWilt, mercury: HMercury,
  butter: HButter, frost: HFrost, holes: HHoles, pulse: HPulse, timecard: HTimecard, dimple: HDimple, morph: HMorph, pinch: HPinch, smash: HSmash, sizzle: HSizzle, dome: HDome,
  mix: HMix, swatch: HSwatch, spike: HSpike, fade: HFade, cubes: HCubes, flatbag: HFlatBag, onion: HOnion, grates: HGrates, bun: HBun, paperbag: HPaperBag };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
