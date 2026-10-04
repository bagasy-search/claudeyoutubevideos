import { registerRoot, Composition } from "remotion";
import React from "react";
import { RosaMain } from "./rosa/RosaMain";
import { PLAN } from "./rosa/plans/abuelamenu";

const Root: React.FC = () => (
  <Composition id="AbuelaMenu" component={RosaMain} durationInFrames={PLAN.total} fps={30} width={1920} height={1080} defaultProps={{ plan: PLAN }} />
);

registerRoot(Root);
