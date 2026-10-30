// stan29d · registro de los componentes únicos (heroes.json → k).
import React from "react";
import { H } from "./hkit";
import { HAka, HBounce, HBrick, HButton, HCooler, HDomino, HDrummer, HFlex, HFreebie, HGem, HGoldilocks, HNotebook, HPadlock, HPea, HPetri, HSawdust, HSignpost, HWindow } from "./sh1";
import { HCandy, HCarousel, HCobweb, HCoins, HEvap, HEyebrow, HFeather, HFountain, HGlue, HMagnet, HMoon, HNeighbors, HPalm, HRapid, HStained, HTaffy, HVersus, HWalnut } from "./sh2";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { brick: HBrick, bounce: HBounce, window: HWindow, padlock: HPadlock, signpost: HSignpost, aka: HAka, flex: HFlex,
  sawdust: HSawdust, gem: HGem, freebie: HFreebie, domino: HDomino, petri: HPetri, cooler: HCooler, pea: HPea, drummer: HDrummer, button: HButton, notebook: HNotebook,
  goldilocks: HGoldilocks, magnet: HMagnet, glue: HGlue, stained: HStained, carousel: HCarousel, cobweb: HCobweb, palm: HPalm, taffy: HTaffy, versus: HVersus,
  walnut: HWalnut, eyebrow: HEyebrow, candy: HCandy, evap: HEvap, fountain: HFountain, moon: HMoon, feather: HFeather, neighbors: HNeighbors, rapid: HRapid, coins: HCoins };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
