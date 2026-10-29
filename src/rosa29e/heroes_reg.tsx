// registro de los componentes únicos de rosa29e (clave de heroes.json → componente)
import React from "react";
import { H } from "./hkit";
import { SoleFork, Alliances, ApronHook, KeyRing10, WaxSeal, SpoonWear, Blot, SoundWave, Signpost, Backlight, Microscope } from "./he1";
import { Shrink, Tongue, Fuse, BurnerDots, Marble, BookGap, Drain, Lift, SteamGhost, Sawdust } from "./he2";
import { CowChart, YarnMelt, NoKnife, Volcano, SmileBubbles, Iron, Theater, Lumps, PartSea, Lemon } from "./he3";
import { SoleFork3, Alliances3, ApronHook3, KeyRing3, WaxSeal3, SpoonWear3, Blot3 } from "./h3d1";
import { SoundWave3, Signpost3, Backlight3, Microscope3, Shrink3, Tongue3, Fuse3 } from "./h3d2";
import { BurnerDots3, Marble3, BookGap3, Drain3, Lift3, SteamGhost3, Sawdust3 } from "./h3d3";
import { WeekTubs3, GiftPot3, Crimp3, Relay3, BillSplit3, Cozy3, Handover3 } from "./h3d6";
import { Lumps3, PartSea3, Lemon3, Evap3, Shutters3, Cube3, FatCap3 } from "./h3d5";
import { CowChart3, YarnMelt3, NoKnife3, Volcano3, SmileBubbles3, Iron3, Theater3 } from "./h3d4";
import { Evap, Shutters, Cube, FatCap, WeekTubs, GiftPot, Crimp, Relay, BillSplit, Cozy, Handover } from "./he4";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = {
  solefork: SoleFork3, alliances: Alliances3, apronhook: ApronHook3, keyring10: KeyRing3, waxseal: WaxSeal3, spoonwear: SpoonWear3, blot: Blot3, soundwave: SoundWave3,
  signpost: Signpost3, backlight: Backlight3, microscope: Microscope3, shrink: Shrink3, tongue: Tongue3, fuse: Fuse3, burnerdots: BurnerDots3, marble: Marble3,
  bookgap: BookGap3, drain: Drain3, lift: Lift3, steamghost: SteamGhost3, sawdust: Sawdust3, cowchart: CowChart3, yarnmelt: YarnMelt3, noknife: NoKnife3,
  volcano: Volcano3, smilebubbles: SmileBubbles3, iron: Iron3, theater: Theater3, lumps: Lumps3, partsea: PartSea3, lemon: Lemon3, evap: Evap3,
  shutters: Shutters3, cube: Cube3, fatcap: FatCap3, weektubs: WeekTubs3, giftpot: GiftPot3, crimp: Crimp3, relay: Relay3, billsplit: BillSplit3, cozy: Cozy3, handover: Handover3,
};
