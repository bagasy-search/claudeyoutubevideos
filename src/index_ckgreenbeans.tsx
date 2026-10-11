// ckgreenbeans · entrada Remotion (Loretta's Church Kitchen, Church Supper Green Beans, libro p.48)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, TOTAL_S } from "./ckgreenbeans/Full";
registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
