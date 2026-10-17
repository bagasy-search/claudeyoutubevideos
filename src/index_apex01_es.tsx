// Entry de apex01_es — Expediente Depredador #1 (versión en español de apex01).
import { registerRoot, Composition } from "remotion";
import React from "react";
import { ApexMain } from "./apex/ApexMain";
import { PLAN } from "./apex/plans/apex01_es";

const Root: React.FC = () => (
  <Composition id="Apex01Es" component={ApexMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
);

registerRoot(Root);
