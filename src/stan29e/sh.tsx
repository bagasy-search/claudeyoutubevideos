// stan29e · registro de los componentes únicos (heroes.json → k).
import React from "react";
import { H } from "./hkit";
import { HBeads, HBelt, HBlindfold, HBuilding, HClubs, HCurl, HHandspan, HLineup, HMallet, HMirror, HOverhang, HPins, HShoelace, HSieve, HSyringe, HVolume } from "./sh1";
import { HAirgap, HBasket, HBlender, HBus, HClothesline, HCracker, HCradle, HDance, HDepth, HFootprints, HLemon, HPhoto, HSign, HSnuff, HSouffle, HSponge, HTrap } from "./sh2";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { overhang: HOverhang, belt: HBelt, pins: HPins, blindfold: HBlindfold, handspan: HHandspan, syringe: HSyringe,
  building: HBuilding, volume: HVolume, mallet: HMallet, curl: HCurl, shoelace: HShoelace, beads: HBeads, lineup: HLineup, sieve: HSieve, clubs: HClubs, mirror: HMirror,
  cracker: HCracker, airgap: HAirgap, sign: HSign, depth: HDepth, snuff: HSnuff, sponge: HSponge, dance: HDance, cradle: HCradle, clothesline: HClothesline,
  souffle: HSouffle, footprints: HFootprints, trap: HTrap, lemon: HLemon, bus: HBus, blender: HBlender, photo: HPhoto, basket: HBasket };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
