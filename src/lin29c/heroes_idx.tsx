// lin29c · mapa clave → componente (las claves salen de spec_lin29c.py)
import React from "react";
import { HAtmCard, HCartCoin, HCellPhoneLot, HExchangeBoard, HGarageMeter, HLoungeDoor, HParkingRings, HReceipt71, HShoesOn, HSpinnerLeash, HWalletCards } from "./heroes_c1";
import { HBankPadlock, HChargePost, HChargerPrice, HFakeSite, HPharmaPouch, HPriceMelt, HPriceTowers, HPurseCharger, HShuttleVan, HSurge, HWifiHook } from "./heroes_c2";
import { HCatScale, HLuggageScale, HMadeFriend, HParkingPillar, HQuietGate, HRoutinePath, HSandwich, HThermos, HTsaTray, HTwoClocks } from "./heroes_c3";
export const HC: Record<string, React.FC<any>> = {
  receipt71: HReceipt71, garagemeter: HGarageMeter, parkingrings: HParkingRings, cellphonelot: HCellPhoneLot, exchangeboard: HExchangeBoard, atmcard: HAtmCard,
  cartcoin: HCartCoin, spinnerleash: HSpinnerLeash, loungedoor: HLoungeDoor, walletcards: HWalletCards, shoeson: HShoesOn,
  fakesite: HFakeSite, chargerprice: HChargerPrice, chargepost: HChargePost, pursecharger: HPurseCharger, pharmapouch: HPharmaPouch, pricetowers: HPriceTowers,
  surge: HSurge, shuttlevan: HShuttleVan, pricemelt: HPriceMelt, wifihook: HWifiHook, bankpadlock: HBankPadlock,
  luggagescale: HLuggageScale, catscale: HCatScale, tsatray: HTsaTray, madefriend: HMadeFriend, twoclocks: HTwoClocks, routinepath: HRoutinePath,
  parkingpillar: HParkingPillar, thermos: HThermos, quietgate: HQuietGate, sandwich: HSandwich,
};
