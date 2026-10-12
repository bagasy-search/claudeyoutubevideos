// lkit · kit permanente Loretta v2: registro de componentes. El linter del plan lee src/lkit/kit_schema.json (mismos nombres).
import React from "react";
import { KIT, OVERLAYS } from "./kit";
import { ITEMS } from "./items";
export * from "./core";
export * from "./kit";
export * from "./items";

// componentes de PLANO (kind C en el plan): { c: "<nombre>", props: {...} }
export const LKIT: Record<string, React.FC<any>> = { ...KIT, ...ITEMS };
// superposiciones (pista aparte encima de otro plano): Kicker, Pop. ItemCounter va por edl.counts.
export const LKIT_OVERLAYS: Record<string, React.FC<any>> = { ...OVERLAYS };
