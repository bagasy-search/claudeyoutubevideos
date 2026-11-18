import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainGary14b, TOTAL_FRAMES } from "./gary11/Main14b";
const Root = () => (
  <>
    <Composition id="Full" component={MainGary14b} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
