import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale1, TOTAL_FRAMES_DALE1 } from "./VideoEdit/Main_dale1";

const RootDale1: React.FC = () => (
  <Composition id="Dale1" component={MainDale1} durationInFrames={TOTAL_FRAMES_DALE1} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale1);
