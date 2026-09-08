import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsricino, TOTAL_FRAMES_FCSRICINO } from "./VideoEdit/Main_fcsricino";

const RootFcsricino: React.FC = () => (
  <Composition id="Fcsricino" component={MainFcsricino} durationInFrames={TOTAL_FRAMES_FCSRICINO} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsricino);
