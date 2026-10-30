// ole29a · mapa clave de heroes.json → componente único
import React from "react";
import { H } from "./hkit";
import { ABalance, ACoins, ACold, ACrack, AFan, AGlow, AGround, AHoles, AMoon, AOdo, ASand, AYard } from "./heroes_a1";
import { ABlow, ABoil, ABreath, ADutch, AJug, ALayers, ALoupe, APlates, ASeal, AShock, AWire } from "./heroes_a2";
import { AArvid, AAroma, ABrush, AComments, ADay, ADial, AJars, ANotebook, AShoe, ATable } from "./heroes_a3";

export const HA: Record<string, React.FC<{ t: number; h: H }>> = {
  a_cold: ACold, a_ground: AGround, a_odo: AOdo, a_balance: ABalance, a_coins: ACoins, a_moon: AMoon, a_yard: AYard, a_holes: AHoles,
  a_glow: AGlow, a_crack: ACrack, a_fan: AFan, a_sand: ASand, a_plates: APlates, a_loupe: ALoupe, a_boil: ABoil, a_blow: ABlow,
  a_dutch: ADutch, a_layers: ALayers, a_jug: AJug, a_shock: AShock, a_seal: ASeal, a_wire: AWire, a_breath: ABreath, a_arvid: AArvid,
  a_brush: ABrush, a_aroma: AAroma, a_day: ADay, a_notebook: ANotebook, a_shoe: AShoe, a_comments: AComments, a_jars: AJars,
  a_dial: ADial, a_table: ATable,
};
