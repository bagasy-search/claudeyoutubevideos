// Entry de abuelaolla — Abuela Rosa #1 "30 Comidas de UNA Sola Olla para Cuando Vives Solo y No Quieres Fregar Nada".
import { registerRoot, Composition } from "remotion";
import React from "react";
import { RosaMain } from "./rosa/RosaMain";
import { PLAN } from "./rosa/plans/abuelaolla";

const Root: React.FC = () => (
  <Composition id="AbuelaOlla" component={RosaMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
);

registerRoot(Root);
