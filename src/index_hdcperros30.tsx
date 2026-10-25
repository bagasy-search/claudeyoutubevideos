import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./hdcperros30/Body";
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
