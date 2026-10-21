// chuy01 · el video COMPLETO (0 → 703,3 s): minuto 1 (Min1) + minutos 2 a 11 (Resto), una sola toma. Audio fuera de Remotion.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./Min1";
import { Resto, FULL_FRAMES } from "./Resto";
export { FULL_FRAMES };
export const Full: React.FC = () => {
  const f = useCurrentFrame();
  return f < MIN1_FRAMES ? <Min1 /> : <Resto t={f / 30} />;
};
