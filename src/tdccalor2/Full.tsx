// tdccalor2 · EL VIDEO ENTERO: minuto 1 (aprobado) + el resto, en un solo hilo. Audio fuera de Remotion (encfin).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./Min1";
import { Rest, REST_END } from "./Rest";
export const FULL_FRAMES = Math.round(REST_END * 30);
export const Full: React.FC = () => {
  const f = useCurrentFrame();
  return f < MIN1_FRAMES ? <Min1 /> : <Rest t={f / 30} />;
};
