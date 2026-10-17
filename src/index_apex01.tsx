// Entry de apex01 — Apex Files #1 (The 4 Animals That Still See Humans as Prey).
import { registerRoot, Composition } from "remotion";
import React from "react";
import { ApexMain } from "./apex/ApexMain";
import { PLAN } from "./apex/plans/apex01";

const Root: React.FC = () => (
  <Composition id="Apex01" component={ApexMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
);

registerRoot(Root);
