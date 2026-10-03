// Entry de abuela80 — Abuela Rosa #2 "40 Cenas Olvidadas que Tu Madre Hacía en los Años 80 Antes de que Llegara el Delivery".
import { registerRoot, Composition } from "remotion";
import React from "react";
import { RosaMain } from "./rosa/RosaMain";
import { PLAN } from "./rosa/plans/abuela80";

const Root: React.FC = () => (
  <Composition id="Abuela80" component={RosaMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
);

registerRoot(Root);
