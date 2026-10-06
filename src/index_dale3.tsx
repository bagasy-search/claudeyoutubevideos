import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale3, TOTAL_FRAMES_DALE3 } from "./VideoEdit/Main_dale3";

const RootDale3: React.FC = () => (
  <Composition id="Dale3" component={MainDale3} durationInFrames={TOTAL_FRAMES_DALE3} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale3);
