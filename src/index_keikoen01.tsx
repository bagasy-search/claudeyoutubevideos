import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./keikoen01/Min1";
import { Rest, REST_END } from "./keikoen01/Rest";
// el video entero: minuto 1 + el resto (Rest usa el tiempo absoluto)
const Full: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill>{f < MIN1_FRAMES ? <Min1 /> : <Rest />}</AbsoluteFill>; };
const Root = () => (
  <>
    <Composition id="Keikoen01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Keikoen01" component={Full} durationInFrames={Math.round(REST_END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={Math.round(REST_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
