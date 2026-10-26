import React from "react";
import { Composition, registerRoot } from "remotion";
import { Ycn01, YCN01_FRAMES } from "./ycn/ycn01/Completo";

const Root = () => (
  <>
    <Composition id="Full" component={Ycn01} durationInFrames={YCN01_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
