import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRaygarage, TOTAL_FRAMES_RAYGARAGE } from "./VideoEdit/Main_raygarage";

const RootRaygarage: React.FC = () => (
  <Composition id="Raygarage" component={MainRaygarage} durationInFrames={TOTAL_FRAMES_RAYGARAGE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRaygarage);
