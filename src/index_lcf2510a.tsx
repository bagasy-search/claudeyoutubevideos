import React from "react";
import { Composition, registerRoot } from "remotion";
import { Full, FULL_FRAMES } from "./lcf2510a/Full";
const Root = () => (
  <>
    <Composition id="Lcf2510aFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
