import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, END } from "./toallaneck/Video";
const Root = () => (
  <>
    <Composition id="Full" component={Video} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
