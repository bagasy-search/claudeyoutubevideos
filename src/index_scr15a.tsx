import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainScr15a, TOTAL_FRAMES } from "./gary11/Main15a";
const Root = () => (
  <>
    <Composition id="Full" component={MainScr15a} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
