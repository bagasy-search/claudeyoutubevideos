import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { ReelCmegenerador, TOTAL_FRAMES_REEL } from "./cmegenerador/Reel_cmegenerador";
const RootReel: React.FC = () => (
  <Composition id="CmegeneradorReel" component={ReelCmegenerador} durationInFrames={TOTAL_FRAMES_REEL} fps={30} width={1920} height={1080} />
);
registerRoot(RootReel);
