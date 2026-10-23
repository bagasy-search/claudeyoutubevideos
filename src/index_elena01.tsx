import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { PantryWorld, sceneOf } from "./elena01/pantry3d";
import { Full, FULL_FRAMES } from "./elena01/Full";
// prueba del mundo: una escena por props (sólo stills locales)
const WorldTest: React.FC<{ name: string; u: number }> = ({ name, u }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><PantryWorld t={u + f / 30} sc={sceneOf(name, u + f / 30)} /></AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Elena01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="ElenaWorld" component={WorldTest} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ name: "jar:fill", u: 3 }} />
  </>
);
registerRoot(Root);
