// rk29d · mapa de componentes únicos (k → componente). Cada k aparece una sola vez en plan.json.
import type React from "react";
import { HEROES_A } from "./heroesA";
import { HEROES_B } from "./heroesB";
import { HEROES_R } from "./heroesR"; import { HEROES_3 } from "./heroes3"; import { HEROES_3B } from "./heroes3b"; import { HEROES_3C } from "./heroes3c";
export const HEROES = { ...HEROES_A, ...HEROES_B, ...HEROES_R, ...HEROES_3, ...HEROES_3B, ...HEROES_3C } as Record<string, React.FC<{ t: number; h: any }>>;
