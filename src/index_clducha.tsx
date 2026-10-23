import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./clducha/Min1";
import { Full, FULL_FRAMES } from "./clducha/Rest";
// Clducha = el video entero (Min1 hasta 107,88 s + Rest); ClduchaMin1 queda para stills rápidos del arranque
const Root = () => (
  <>
    <Composition id="Clducha" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="ClduchaMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
