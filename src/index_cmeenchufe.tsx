import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmeenchufe, TOTAL_FRAMES_CMEENCHUFE } from "./cmeenchufe/Main_cmeenchufe";
const RootCmeenchufe: React.FC = () => (
  <Composition id="Cmeenchufe" component={MainCmeenchufe} durationInFrames={TOTAL_FRAMES_CMEENCHUFE} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmeenchufe);
