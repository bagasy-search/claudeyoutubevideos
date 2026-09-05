import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRaybar1, TOTAL_FRAMES_RAYBAR1 } from "./VideoEdit/Main_raybar1";

const RootRaybar1: React.FC = () => (
  <Composition id="Raybar1" component={MainRaybar1} durationInFrames={TOTAL_FRAMES_RAYBAR1} fps={30} width={1920} height={1080} />
);
registerRoot(RootRaybar1);
