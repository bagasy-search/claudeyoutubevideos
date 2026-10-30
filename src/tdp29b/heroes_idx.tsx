// tdp29b · mapa clave → componente (las claves salen de spec_tdp29b.py)
import React from "react";
import { HBirths, HBusStop, HDolls, HGrades, HReplace, HReuse, HScarecrow, HSchools, HValley } from "./heroes_b1";
import { HAkiya, HEighteen, HGenkai, HGraduation, HGrave, HMikoshi, HRice, HStation, HTruck } from "./heroes_b2";
import { HApartment, HAya, HBicycle, HCityKids, HFerry, HDollsEnd, HFork, HMoney, HPhoneCall, HRaised, HThree, HVillageDay } from "./heroes_b3";
export const HC: Record<string, React.FC<any>> = {
  dolls: HDolls, schools: HSchools, valley: HValley, busstop: HBusStop, scarecrow: HScarecrow, births: HBirths, replace: HReplace, grades: HGrades,
  station: HStation, graduation: HGraduation, eighteen: HEighteen, akiya: HAkiya, genkai: HGenkai, truck: HTruck, rice: HRice, grave: HGrave,
  mikoshi: HMikoshi, apartment: HApartment, fork: HFork, money: HMoney, villageday: HVillageDay, raised: HRaised, reuse: HReuse, three: HThree,
  aya: HAya, bicycle: HBicycle, dollsend: HDollsEnd, phonecall: HPhoneCall, citykids: HCityKids, ferry: HFerry,
};
