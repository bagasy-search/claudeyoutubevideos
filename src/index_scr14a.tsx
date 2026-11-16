import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainScr14a, TOTAL_FRAMES } from "./gary11/Main14p";
const Root = () => (
  <>
    <Composition id="Full" component={MainScr14a} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
