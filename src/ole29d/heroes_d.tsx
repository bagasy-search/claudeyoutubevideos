// ole29d · mapa clave → componente único (d_five y d_recap son los dos carruseles, los arma Body)
import React from "react";
import { H } from "./hkit";
import { DCubes, DChain, DFlap, DGrid, DJobs, DMicro, DMud, DPalm, DReceipt, DSeal, DSlide, DSwell } from "./heroes_d1";
import { DBurn, DCrowd, DFlip, DGreaseCan, DItaly, DPierogi, DPostcard, DRail, DSmash, DSpoon, DToss, DWrap } from "./heroes_d2";
import { DBagBox, DBread, DChalk, DCleanout, DCount, DFamily, DOneFire, DShrink, DSize, DTally, DThree } from "./heroes_d3";

export const HA1: Record<string, React.FC<{ t: number; h: H }>> = {
  d_mud: DMud, d_jobs: DJobs, d_grid: DGrid, d_seal: DSeal, d_receipt: DReceipt, d_flap: DFlap, d_micro: DMicro, d_chain: DChain,
  d_cubes: DCubes, d_swell: DSwell, d_palm: DPalm, d_slide: DSlide, d_flip: DFlip, d_rail: DRail, d_toss: DToss, d_spoon: DSpoon,
  d_italy: DItaly, d_crowd: DCrowd, d_wrap: DWrap, d_greasecan: DGreaseCan, d_smash: DSmash, d_pierogi: DPierogi, d_burn: DBurn,
  d_postcard: DPostcard, d_shrink: DShrink, d_tally: DTally, d_bread: DBread, d_cleanout: DCleanout, d_chalk: DChalk,
  d_bagbox: DBagBox, d_three: DThree, d_onefire: DOneFire, d_family: DFamily, d_size: DSize, d_count: DCount,
};

// ronda 2 del evaluador (29-oct): objetos reales recortados; la ronda 1 queda como HA1 sólo de referencia
export { HA } from "./heroes_r4"; // ronda 4: reemplazo simple de lo que no llegó a 8 en 3 vueltas
