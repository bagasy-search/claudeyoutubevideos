// sachiko4 · entrada de Remotion
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, TOTAL_S } from "./sachiko4/Full";
registerRoot(() => (
  <Composition id="Sachiko4" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
