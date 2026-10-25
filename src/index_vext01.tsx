import React from "react";
import { Composition, registerRoot } from "remotion";
import { Clip, CLIP_FRAMES } from "./vext01/Clip";

const Root = () => (
  <>
    <Composition id="Full" component={Clip} durationInFrames={CLIP_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
