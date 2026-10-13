import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkcams, TOTAL_FRAMES_RKCAMS } from "./VideoEdit/Main_rkcams";

const RootRkcams: React.FC = () => (
  <Composition id="Rkcams" component={MainRkcams} durationInFrames={TOTAL_FRAMES_RKCAMS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkcams);
