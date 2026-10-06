import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmegenerador, TOTAL_FRAMES_CMEGENERADOR } from "./cmegenerador/Main_cmegenerador";
const RootCmegenerador: React.FC = () => (
  <Composition id="Cmegenerador" component={MainCmegenerador} durationInFrames={TOTAL_FRAMES_CMEGENERADOR} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmegenerador);
