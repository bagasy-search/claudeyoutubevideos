// _v3/rkspots_prompts.mjs — POOL del DIRECTOR de rkspots (union de los 6 lotes por seccion).
import { ITEMS_A } from './rkspots_pA.mjs';
import { ITEMS_B } from './rkspots_pB.mjs';
import { ITEMS_C } from './rkspots_pC.mjs';
import { ITEMS_D } from './rkspots_pD.mjs';
import { ITEMS_E } from './rkspots_pE.mjs';
import { ITEMS_F } from './rkspots_pF.mjs';
export const ITEMS = [...ITEMS_A, ...ITEMS_B, ...ITEMS_C, ...ITEMS_D, ...ITEMS_E, ...ITEMS_F];
