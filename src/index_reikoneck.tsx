import React from "react";
import { Composition, registerRoot } from "remotion";
import { Test, TEST_N } from "./reikoneck/Test";
import { Video, END } from "./reikoneck/Video";
const Root = () => (
  <>
    <Composition id="Full" component={Video} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Test" component={Test} durationInFrames={TEST_N * 30} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
