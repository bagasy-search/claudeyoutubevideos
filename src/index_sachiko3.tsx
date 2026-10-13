import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, TOTAL_S } from "./sachiko3/Full";

const Root: React.FC = () => (
  <Composition id="Sachiko3" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
