import React from "react";
import { Composition } from "remotion";
import { MainFcsflema, TOTAL_FRAMES_FCSFLEMA } from "./fcsflema/Main_fcsflema";
import { registerRoot } from "remotion";
export const RootFcsflema: React.FC = () => (
  <Composition id="Fcsflema" component={MainFcsflema} durationInFrames={TOTAL_FRAMES_FCSFLEMA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsflema);
