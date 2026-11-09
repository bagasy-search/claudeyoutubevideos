import React from "react";
import { Composition, registerRoot } from "remotion";
import { Esc1 } from "./blt01/esc1";
import { ES234 } from "./blt01/esc2";
import { Body, END } from "./blt01/Body";
const Root = () => (
  <>
    <Composition id="E1" component={Esc1} durationInFrames={209} fps={30} width={1920} height={1080} />
    <Composition id="ES234" component={ES234} durationInFrames={904} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
