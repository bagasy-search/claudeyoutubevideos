import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES, MIN1_END, World } from "./mecdesemp/Min1";
import { Rest, FULL_END } from "./mecdesemp/Rest";
// el video entero = minuto 1 (mundo 3D) + el resto, un solo hilo
const Full: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill>{t < MIN1_END ? <Min1 /> : <Rest />}</AbsoluteFill>; };
const Root = () => (
  <>
    <Composition id="MecdesempMundo" component={() => <World t={MIN1_END - 0.6} />} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="MecdesempMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Mecdesemp" component={Full} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
