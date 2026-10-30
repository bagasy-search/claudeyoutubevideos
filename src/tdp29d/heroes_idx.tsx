// tdp29d · mapa clave → componente (las claves salen de spec_tdp29d.py)
import React from "react";
import { HBriefcase, HBurden, HEvaporate, HFunnel, HMeiwaku, HNumber, HSuit, HThreeDoors, HTruck, HYonige } from "./heroes_d1";
import { HDetective, HDoya, HFallOut, HFortyFour, HMapDistricts, HOranges, HPorch, HRegistry, HSocks, HSoup } from "./heroes_d2";
import { HDayJ, HEconomy, HEleven, HFloor, HGrave, HLastLine, HLetterJ, HMessage, HNoFloor, HPhoto, HQuestions } from "./heroes_d3";
export const HC: Record<string, React.FC<any>> = {
  truck: HTruck, evaporate: HEvaporate, number: HNumber, yonige: HYonige, threedoors: HThreeDoors, funnel: HFunnel, meiwaku: HMeiwaku, burden: HBurden,
  suit: HSuit, briefcase: HBriefcase, map: HMapDistricts, doya: HDoya, fortyfour: HFortyFour, registry: HRegistry, fallout: HFallOut, socks: HSocks,
  oranges: HOranges, detective: HDetective, porch: HPorch, soup: HSoup, eleven: HEleven, economy: HEconomy, day: HDayJ, photo: HPhoto,
  questions: HQuestions, floor: HFloor, nofloor: HNoFloor, letter: HLetterJ, lastline: HLastLine, grave: HGrave, message: HMessage,
};
