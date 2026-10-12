// ckbreak · entrada de Remotion (Loretta church breakfasts, plan-own-1791289087716-8)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, TOTAL_S } from "./ckbreak/Full";
registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
