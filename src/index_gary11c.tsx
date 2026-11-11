import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainGary11c, TOTAL_FRAMES } from "./gary11/Main";
const Root = () => (
  <>
    <Composition id="Full" component={MainGary11c} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
