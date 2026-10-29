// rk29b · mapa de componentes únicos (k → componente). Cada k aparece una sola vez en plan.json.
// 29-oct: los 45 rehechos en 3D (heroes3/3b/3c); los 2D de heroesA/B quedan sólo de respaldo.
import type React from "react";
import { HEROES_A } from "./heroesA";
import { HEROES_B } from "./heroesB";
import { HEROES_3 } from "./heroes3";
import { HEROES_3B } from "./heroes3b";
import { HEROES_3C } from "./heroes3c";
import { HEROES_3R } from "./heroes3r"; import { HEROES_3S } from "./heroes3s";
export const HEROES = { ...HEROES_A, ...HEROES_B, ...HEROES_3, ...HEROES_3B, ...HEROES_3C, ...HEROES_3R, ...HEROES_3S } as Record<string, React.FC<{ t: number; h: any }>>;
