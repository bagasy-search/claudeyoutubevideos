import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainLcf11b, TOTAL_LCF11B } from "./lcf11b/Main";

const Root: React.FC = () => (
  <Composition id="Lcf11b" component={MainLcf11b} durationInFrames={TOTAL_LCF11B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
