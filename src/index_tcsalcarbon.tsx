import "./tcsalcarbon/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTcsalcarbon, TOTAL_FRAMES_TCSALCARBON } from "./tcsalcarbon/Main_tcsalcarbon";
const Root: React.FC = () => (
  <Composition id="Tcsalcarbon" component={MainTcsalcarbon} durationInFrames={TOTAL_FRAMES_TCSALCARBON} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
