import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainEpwolves, TOTAL_FRAMES_EPWOLVES } from "./VideoEdit/Main_epwolves";

const RootEpwolves: React.FC = () => (
  <Composition id="Epwolves" component={MainEpwolves} durationInFrames={TOTAL_FRAMES_EPWOLVES} fps={30} width={1920} height={1080} />
);
registerRoot(RootEpwolves);
