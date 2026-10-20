import React from "react";
import { Composition, registerRoot } from "remotion";
import { Doc, DOC_FRAMES } from "./cpestructuras/Doc";
const Root = () => (
  <>
    <Composition id="CPEFULL" component={Doc} durationInFrames={DOC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="CPEPREV" component={Doc} durationInFrames={DOC_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: false }} />
  </>
);
registerRoot(Root);
