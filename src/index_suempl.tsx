// suempl · entrada de Remotion. Composiciones: "Min1" (R4) y "Full" (0-400 s, R5).
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Min1 } from "./suempl/Min1";
import { Full } from "./suempl/Full";
registerRoot(() => (
  <>
    <Composition id="Min1" component={Min1} durationInFrames={65 * 30} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={965 * 30} fps={30} width={1920} height={1080} />
  </>
));
