// tdccalor3 · EL VIDEO ENTERO: gancho LTX (0 → HOOK) + la locución desde HOOK (minuto 1 + el resto). Audio fuera de Remotion (encfin).
import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { Gancho, HOOK } from "./Gancho";
import { Min1Body, MIN1_END, MIN1_FRAMES } from "./Min1";
import { RestBody, REST_END } from "./Rest";
import { s } from "./lib";

export { REST_END };
export const FULL_FRAMES = s(HOOK) + s(REST_END);
export const MIN1_ALL = s(HOOK) + MIN1_FRAMES;
const Voz: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return t < MIN1_END ? <Min1Body t={t} /> : <RestBody t={t} />;
};
export const Full: React.FC = () => (
  <>
    <Sequence durationInFrames={s(HOOK)}><Gancho /></Sequence>
    <Sequence from={s(HOOK)}><Voz /></Sequence>
  </>
);
