import React from "react";
import { AbsoluteFill, Composition, Sequence, registerRoot } from "remotion";
import { Min1, MIN1_FRAMES } from "./cme3d01/Min1";
import { Cta2, CTA2_FRAMES } from "./cme3d01/Cta2";
import { Rest, FULL_FRAMES } from "./cme3d01/Rest";
import { s } from "./cme3d01/lib";
// video entero: el minuto 1 + la guía hasta 99,42 s (entra el avatar del "segundo día") y desde ahí Rest
const Full = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={s(99.42) + 1} layout="none"><Min1 /></Sequence>
    <Rest />
  </AbsoluteFill>
);
const Root = () => (
  <>
    <Composition id="Cme3d01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Cme3d01Cta2" component={Cta2} durationInFrames={CTA2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Cme3d01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
