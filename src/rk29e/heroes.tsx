// rk29e · mapa de componentes únicos (k → componente). Cada k aparece una sola vez en plan.json.
import type React from "react";
import { HEROES_E1 } from "./heroesE1";
import { HEROES_E2 } from "./heroesE2";
import { HEROES_E3 } from "./heroesE3";
export const HEROES = { ...HEROES_E1, ...HEROES_E2, ...HEROES_E3 } as Record<string, React.FC<{ t: number; h: any }>>;
