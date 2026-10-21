import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./rhmoldtest/Min1";
import { Rest, END } from "./rhmoldtest/Rest";
const FULL_FRAMES = Math.round(END * 30);
// el video entero: minuto 1 tal cual + el resto (Rest usa el tiempo absoluto, por eso no va desplazado)
const Full: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#0b0e13" }}>{f < MIN1_FRAMES ? <Min1 /> : <Rest />}</AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="RhmoldtestMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="RhmoldtestFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
