import React from "react";
import { Composition, registerRoot } from "remotion";
import { Rest, END_T } from "./chpozole/Rest";
const Root = () => (
  <>
    <Composition id="ChpozoleFull" component={Rest} durationInFrames={Math.round(END_T * 30)} fps={30} width={1920} height={1080} />
    <Composition id="ChpozoleMin1" component={Rest} durationInFrames={97 * 30} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
