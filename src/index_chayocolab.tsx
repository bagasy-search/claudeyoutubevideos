import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, END_T } from "./chayocolab/Main";
const Root = () => (
  <>
    <Composition id="Full" component={Main} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
