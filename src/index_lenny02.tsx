import React from "react";
import { Composition, registerRoot, Sequence } from "remotion";
import { setSlug } from "./kits/yanqui3d/lib";
import { Test3d } from "./lenny02/Test3d";
import { Min1, MIN1_FRAMES } from "./lenny02/Min1";
import { Rest, FULL_FRAMES } from "./lenny02/Rest";
setSlug("lenny02");
const Full = () => (
  <>
    <Sequence durationInFrames={MIN1_FRAMES} layout="none"><Min1 /></Sequence>
    <Rest />
  </>
);
const Root = () => (
  <>
    <Composition id="Lenny02Test3d" component={Test3d} durationInFrames={8} fps={30} width={1920} height={1080} />
    <Composition id="Lenny02Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Lenny02Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
