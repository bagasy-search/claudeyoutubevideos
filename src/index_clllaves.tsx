import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END } from "./clllaves/Min1";
import { Rest, FULL_END } from "./clllaves/Rest";
// el video entero: el minuto 1 aprobado hasta 100,8 s y el resto después (mismo reloj global)
const Full: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill>{t < MIN1_END ? <Min1 /> : <Rest />}</AbsoluteFill>; };
const Root = () => (
  <>
    <Composition id="ClllavesMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Clllaves" component={Full} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
