import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./hal01/Min1";
import { Rest, END } from "./hal01/Rest";
// video entero: el minuto 1 sigue debajo hasta que el portal del resto lo tapa; Rest usa el mismo cuadro absoluto
const Full: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#05070b" }}>{f < MIN1_FRAMES + 10 && <Min1 />}<Rest /></AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Hal01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Hal01" component={Full} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
