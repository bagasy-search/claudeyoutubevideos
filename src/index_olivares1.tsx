import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainOlivares1, TOTAL_FRAMES_OLIVARES1 } from "./VideoEdit/Main_olivares1";

const RootOlivares1: React.FC = () => (
  <Composition id="Olivares1" component={MainOlivares1} durationInFrames={TOTAL_FRAMES_OLIVARES1} fps={30} width={1920} height={1080} />
);
registerRoot(RootOlivares1);
