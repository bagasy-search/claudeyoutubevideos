import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainEpguam, TOTAL_FRAMES_EPGUAM } from "./VideoEdit/Main_epguam";

const RootEpguam: React.FC = () => (
  <Composition id="Epguam" component={MainEpguam} durationInFrames={TOTAL_FRAMES_EPGUAM} fps={30} width={1920} height={1080} />
);
registerRoot(RootEpguam);
