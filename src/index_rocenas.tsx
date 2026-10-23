import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, END_T, MIN1_END } from "./rocenas/Main";
const Root = () => (
  <>
    <Composition id="RocenasFull" component={Main} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
    <Composition id="RocenasMin1" component={Main} durationInFrames={Math.round(MIN1_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
