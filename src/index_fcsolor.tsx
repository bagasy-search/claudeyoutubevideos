import React from "react";
import { Composition } from "remotion";
import { MainFcsolor, TOTAL_FRAMES_FCSOLOR } from "./fcsolor/Main_fcsolor";
import { registerRoot } from "remotion";
export const RootFcsolor: React.FC = () => (
  <Composition id="Fcsolor" component={MainFcsolor} durationInFrames={TOTAL_FRAMES_FCSOLOR} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsolor);
