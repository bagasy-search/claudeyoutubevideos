import React from "react";
import { Composition, registerRoot, Sequence } from "remotion";
import { Min1, MIN1_FRAMES } from "./ck2510a/Min1";
import { Rest, FULL_FRAMES } from "./ck2510a/Rest";
import { HallTest, TEST } from "./ck2510a/HallTest";
const Full = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence>
    <Rest />
  </>
);
const Root = () => (
  <>
    <Composition id="Ck2510aMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Ck2510aFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Ck2510aHall" component={HallTest} durationInFrames={TEST.length * 90} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
