// rk29a · mapa de componentes únicos (k → componente). Cada k aparece una sola vez en plan.json.
import type React from "react";
import { HEROES_A } from "./heroesA";
import { HEROES_B } from "./heroesB";
import { HEROES_3 } from "./heroes3";
import { HEROES_3B } from "./heroes3b";
import { HEROES_3C } from "./heroes3c";
import { HEROES_3D } from "./heroes3d";
import { HEROES_3E } from "./heroes3e";
export const HEROES = { ...HEROES_A, ...HEROES_B, ...HEROES_3, ...HEROES_3B, ...HEROES_3C, ...HEROES_3D, ...HEROES_3E } as Record<string, React.FC<{ t: number; h: any }>>;
