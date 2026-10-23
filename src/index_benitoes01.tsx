import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { World } from "./benitoes01/world3d";
import { Full, FULL_FRAMES } from "./benitoes01/Video";
const WorldOnly: React.FC = () => { const t = useCurrentFrame() / 30; return <AbsoluteFill style={{ background: "#000" }}><World t={t} /></AbsoluteFill>; };
const Root = () => (
  <>
    <Composition id="Benitoes01World" component={WorldOnly} durationInFrames={Math.ceil(1292 * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Benitoes01Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
