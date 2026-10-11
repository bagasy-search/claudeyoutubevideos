// ckbeanpot · entry propio (Loretta's Church Kitchen, all-day bean pot)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, TOTAL_S } from "./ckbeanpot/Full";
registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
