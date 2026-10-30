// lin29b · mapa clave → componente (las claves salen de spec_lin29b.py)
import React from "react";
import { HBeadChain, HBottleBag, HDoubleTip, HFiveGlasses, HPlaneShip, HSatDish, HShipLeaves, HStairs, HTapCard, HToggle } from "./heroes_b1";
import { HAdMap, HBorder, HCloche, HCrutch, HDayBefore, HFrames, HPillPouch, HRollBag, HSoapSink, HUmbrella } from "./heroes_b2";
import { HBracelets, HCardLimit, HDeadPhone, HEasel, HMidShip, HPassport, HPriceWave, HThinEnvelope, HTvCheck, HWhaleTail } from "./heroes_b3";
export const HC: Record<string, React.FC<any>> = {
  planeship: HPlaneShip, tapcard: HTapCard, fiveglasses: HFiveGlasses, bottlebag: HBottleBag, doubletip: HDoubleTip, beadchain: HBeadChain,
  shipleaves: HShipLeaves, stairs: HStairs, satdish: HSatDish, toggle: HToggle,
  cloche: HCloche, frames: HFrames, border: HBorder, crutch: HCrutch, umbrella: HUmbrella, pillpouch: HPillPouch, daybefore: HDayBefore,
  rollbag: HRollBag, soapsink: HSoapSink, admap: HAdMap,
  bracelets: HBracelets, pricewave: HPriceWave, whaletail: HWhaleTail, tvcheck: HTvCheck, cardlimit: HCardLimit, passport: HPassport,
  easel: HEasel, deadphone: HDeadPhone, midship: HMidShip, thinenvelope: HThinEnvelope,
};
