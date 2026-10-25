import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, END_T } from "./lu30charros/Video";
const Root = () => (
  <>
    <Composition id="Full" component={Video} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
