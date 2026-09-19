import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRksmart, TOTAL_FRAMES_RKSMART } from "./VideoEdit/Main_rksmart";

const RootRksmart: React.FC = () => (
  <Composition id="Rksmart" component={MainRksmart} durationInFrames={TOTAL_FRAMES_RKSMART} fps={30} width={1920} height={1080} />
);
registerRoot(RootRksmart);
