import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTeislandia, TOTAL_FRAMES_TEISLANDIA } from "./VideoEdit/Main_teislandia";

const RootTeislandia: React.FC = () => (
  <Composition id="Teislandia" component={MainTeislandia} durationInFrames={TOTAL_FRAMES_TEISLANDIA} fps={30} width={1920} height={1080} />
);
registerRoot(RootTeislandia);
