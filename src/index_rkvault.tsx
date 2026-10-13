import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkvault, TOTAL_FRAMES_RKVAULT } from "./VideoEdit/Main_rkvault";

const RootRkvault: React.FC = () => (
  <Composition id="Rkvault" component={MainRkvault} durationInFrames={TOTAL_FRAMES_RKVAULT} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkvault);
