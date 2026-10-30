// lin29a · mapa clave → componente (las claves salen de spec_lin29a.py)
import React from "react";
import { HCityBlock, HFeePrism, HFeeScale, HFourMin, HGrocery, HNights, HSecondBill, HSensor, HTapeStrip, HThreeRates } from "./heroes_a1";
import { HDeadline, HDeskOnly, HNonRef, HParkFly, HRoomBoard, HRoomPhone, HShower, HSignCard, HWifi } from "./heroes_a2";
import { HHold, HJar, HMagnifier, HPillow, HRoutine, HSafe, HSentence, HTripMap, HTwice } from "./heroes_a3";
export const HC: Record<string, React.FC<any>> = {
  nights: HNights, secondbill: HSecondBill, fourmin: HFourMin, threerates: HThreeRates, feeprism: HFeePrism, feescale: HFeeScale, sensor: HSensor,
  tapestrip: HTapeStrip, grocery: HGrocery, cityblock: HCityBlock, parkfly: HParkFly, roomboard: HRoomBoard, wifi: HWifi, roomphone: HRoomPhone,
  deskonly: HDeskOnly, shower: HShower, nonref: HNonRef, deadline: HDeadline, signcard: HSignCard, sentence: HSentence, magnifier: HMagnifier,
  hold: HHold, routine: HRoutine, tripmap: HTripMap, safe: HSafe, pillow: HPillow, twice: HTwice, jar: HJar,
};
