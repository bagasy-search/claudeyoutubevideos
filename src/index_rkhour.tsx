import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkhour, TOTAL_FRAMES_RKHOUR } from "./VideoEdit/Main_rkhour";

const RootRkhour: React.FC = () => (
  <Composition id="Rkhour" component={MainRkhour} durationInFrames={TOTAL_FRAMES_RKHOUR} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkhour);
