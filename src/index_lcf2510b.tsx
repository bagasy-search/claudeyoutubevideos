import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { LorettaWorld, sceneOf } from "./lcf2510b/pan3d";
import { Full, FULL_FRAMES } from "./lcf2510b/Full";
// prueba del mundo: cada segundo una escena de la lista (sólo stills locales)
const TEST = ["wide", "pan:1", "top:3", "low:6", "macro:10", "sizzle:4", "lid:6", "heat", "deglaze", "wipe", "big", "oven", "book:087", "plate:7", "candle:10", "flip:2", "stir:5", "pan:8", "top:9", "chair", "bag", "macro:7"];
const WorldTest: React.FC = () => {
  const f = useCurrentFrame(), i = Math.floor(f / 30) % TEST.length, u = 3 + (f % 30) / 30;
  return <AbsoluteFill style={{ background: "#000" }}><LorettaWorld t={u} sc={sceneOf(TEST[i], u)} /></AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="Lcf2510bFull" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="PanWorld" component={WorldTest} durationInFrames={30 * TEST.length} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
