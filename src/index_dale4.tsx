import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale4, TOTAL_FRAMES_DALE4 } from "./VideoEdit/Main_dale4";

const RootDale4: React.FC = () => (
  <Composition id="Dale4" component={MainDale4} durationInFrames={TOTAL_FRAMES_DALE4} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale4);
