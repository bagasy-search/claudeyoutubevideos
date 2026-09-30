import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkalarm, TOTAL_FRAMES_RKALARM } from "./VideoEdit/Main_rkalarm";

const RootRkalarm: React.FC = () => (
  <Composition id="Rkalarm" component={MainRkalarm} durationInFrames={TOTAL_FRAMES_RKALARM} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkalarm);
