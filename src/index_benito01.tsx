import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { World } from "./benito01/world3d";
import { Full, FULL_FRAMES } from "./benito01/Video";
const WorldOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#000" }}><World t={t} /></AbsoluteFill>; };
const Root = () => (
  <>
    <Composition id="Benito01World" component={WorldOnly} durationInFrames={Math.ceil(1170 * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Benito01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
