import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkspots, TOTAL_FRAMES_RKSPOTS } from "./VideoEdit/Main_rkspots";

const RootRkspots: React.FC = () => (
  <Composition id="Rkspots" component={MainRkspots} durationInFrames={TOTAL_FRAMES_RKSPOTS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkspots);
