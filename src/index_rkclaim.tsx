import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkclaim, TOTAL_FRAMES_RKCLAIM } from "./VideoEdit/Main_rkclaim";

const RootRkclaim: React.FC = () => (
  <Composition id="Rkclaim" component={MainRkclaim} durationInFrames={TOTAL_FRAMES_RKCLAIM} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkclaim);
