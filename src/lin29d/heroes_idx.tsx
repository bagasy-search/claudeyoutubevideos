// lin29d · mapa clave → componente (las claves salen de spec_lin29d.py)
import React from "react";
import { HAvoidTolls, HCounterStack, HDailyMeter, HFuelTank, HGpsVsPhone, HHalfPrice, HPumpMiles, HTollFee, HTwiceCover, HTwoCalls } from "./heroes_d1";
import { HFeeTrain, HKneeCar, HPhotoProof, HSandMat, HScratchBill, HSearchTwice, HSpouseFree, HUpgrade84, HVentHolder, HWalkAround } from "./heroes_d2";
import { HAllSet, HDebitHold, HGlasses, HMirrors, HNoThanks, HPriceDrop, HCarLift, HSwapCar, HTouristSign } from "./heroes_d3";
export const HC: Record<string, React.FC<any>> = {
  counterstack: HCounterStack, halfprice: HHalfPrice, dailymeter: HDailyMeter, twicecover: HTwiceCover, twocalls: HTwoCalls, fueltank: HFuelTank,
  pumpmiles: HPumpMiles, tollfee: HTollFee, avoidtolls: HAvoidTolls, gpsvsphone: HGpsVsPhone,
  ventholder: HVentHolder, spousefree: HSpouseFree, kneecar: HKneeCar, upgrade84: HUpgrade84, feetrain: HFeeTrain, searchtwice: HSearchTwice,
  scratchbill: HScratchBill, photoproof: HPhotoProof, walkaround: HWalkAround, sandmat: HSandMat,
  debithold: HDebitHold, carlift: HCarLift, pricedrop: HPriceDrop, glasses: HGlasses, nothanks: HNoThanks, mirrors: HMirrors,
  touristsign: HTouristSign, swapcar: HSwapCar, allset: HAllSet,
};
