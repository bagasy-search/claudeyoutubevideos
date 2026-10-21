import React from "react";
import { Composition, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./hdcesq/Min1";
import { Hdcesq, HDCESQ_FRAMES } from "./hdcesq/Rest";
const Root = () => (
  <>
    <Composition id="HdcesqMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Hdcesq" component={Hdcesq} durationInFrames={HDCESQ_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
