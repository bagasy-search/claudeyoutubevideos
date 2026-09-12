import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { ReelCmeurgente, TOTAL_FRAMES_REEL } from "./cmeurgente/Reel_cmeurgente";
const RootReel: React.FC = () => (
  <Composition id="CmeurgenteReel" component={ReelCmeurgente} durationInFrames={TOTAL_FRAMES_REEL} fps={30} width={1920} height={1080} />
);
registerRoot(RootReel);
