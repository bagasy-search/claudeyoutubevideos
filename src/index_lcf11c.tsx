import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLcf11c, TOTAL_LCF11C } from "./lcf11c/Main";

const Root: React.FC = () => (
  <Composition id="Lcf11c" component={MainLcf11c} durationInFrames={TOTAL_LCF11C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
