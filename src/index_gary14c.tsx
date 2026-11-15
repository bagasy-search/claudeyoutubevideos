import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainGary14c, TOTAL_FRAMES } from "./gary11/Main14c";
const Root = () => (
  <>
    <Composition id="Full" component={MainGary14c} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
