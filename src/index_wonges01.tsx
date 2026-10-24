import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, FULL_FRAMES, MIN1_FRAMES } from "./wonges01/Main";
const Root = () => (
  <>
    <Composition id="WongEsMin1" component={Main} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="WongEsFull" component={Main} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
