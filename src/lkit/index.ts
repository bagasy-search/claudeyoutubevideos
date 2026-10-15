// lkit · kit permanente Loretta v2: registro de componentes. El linter del plan lee src/lkit/kit_schema.json (mismos nombres).
import React from "react";
import { KIT, OVERLAYS } from "./kit";
import { ITEMS } from "./items";
import { CHEAP_OVERLAYS, CHEAP_SHOTS } from "./cheap";
export * from "./core";
export * from "./kit";
export * from "./items";
export * from "./cheap";

// componentes de PLANO (kind C en el plan): { c: "<nombre>", props: {...} }
export const LKIT: Record<string, React.FC<any>> = { ...KIT, ...ITEMS, ...CHEAP_SHOTS };
// superposiciones (pista aparte encima de otro plano): Kicker, Pop, y el kit TheCheapFix (BigLine, PricePill, Leak). ItemCounter va por edl.counts.
export const LKIT_OVERLAYS: Record<string, React.FC<any>> = { ...OVERLAYS, ...CHEAP_OVERLAYS };
