import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_FRAMES } from "./frank01/Min1";
import { rest, FULL_FRAMES } from "./frank01/Rest";
// el motor del resto trabaja en segundos absolutos de la voz: sin Sequence con corrimiento
const Full: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}>{f < MIN1_FRAMES ? <Min1 /> : <rest.Body />}</AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Frank01Min1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Frank01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
