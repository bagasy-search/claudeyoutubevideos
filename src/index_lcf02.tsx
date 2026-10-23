import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { LorettaWorld, sceneOf } from "./lcf02/tin3d";
import { Full, FULL_FRAMES } from "./lcf02/Full";
// prueba del mundo: una escena por props (sólo stills locales)
const WorldTest: React.FC<{ name: string; u: number }> = ({ name, u }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><LorettaWorld t={u + f / 30} sc={sceneOf(name, u + f / 30)} /></AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Lcf02Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="LorettaWorld" component={WorldTest} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ name: "wide", u: 3 }} />
  </>
);
registerRoot(Root);
