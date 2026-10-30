// tdp29e · mapa clave → componente (las claves salen de spec_tdp29e.py)
import React from "react";
import { HAisle, HBills, HBow, HBurdenE, HFalling, HOneFive, HOnigiri, HPension, HSticker, HTea, HWallet, HWidow } from "./heroes_e1";
import { HCake, HEmptyHouse, HFuton, HGate, HLetters, HNurse, HOffers, HRevolving, HSeparate, HSewing, HTrainMap, HYard } from "./heroes_e2";
import { HApron, HCityMove, HFivePM, HHall, HKettle, HQuestionsE, HRadio, HSeat, HSteal, HThreeGen, HThursday } from "./heroes_e3";
export const HC: Record<string, React.FC<any>> = {
  onigiri: HOnigiri, bow: HBow, wallet: HWallet, onefive: HOneFive, tea: HTea, falling: HFalling, widow: HWidow, pension: HPension, bills: HBills, sticker: HSticker, burden: HBurdenE, aisle: HAisle,
  cake: HCake, emptyhouse: HEmptyHouse, separate: HSeparate, offers: HOffers, futon: HFuton, sewing: HSewing, yard: HYard, nurse: HNurse, letters: HLetters, revolving: HRevolving, gate: HGate, trainmap: HTrainMap,
  fivepm: HFivePM, kettle: HKettle, radio: HRadio, threegen: HThreeGen, citymove: HCityMove, questions: HQuestionsE, steal: HSteal, hall: HHall, seat: HSeat, apron: HApron, thursday: HThursday,
};
