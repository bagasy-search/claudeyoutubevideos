import React from "react";
import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from "remotion";
import { Min1, MIN1_END, MIN1_FRAMES } from "./ctrinodoro/Min1";
import { Body, END } from "./ctrinodoro/Body";
// video entero: el minuto 1 aprobado y el cuerpo encima (el cuerpo entra con su latigazo sobre el final del minuto 1)
const Full: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return <AbsoluteFill style={{ background: "#05070b" }}>{t < MIN1_END + 0.4 && <Min1 />}{t >= MIN1_END - 0.5 && <AbsoluteFill><Body /></AbsoluteFill>}</AbsoluteFill>;
};
const Root = () => (
  <>
    <Composition id="CtrInodoroMin1" component={Min1} durationInFrames={MIN1_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="CtrInodoro" component={Full} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
