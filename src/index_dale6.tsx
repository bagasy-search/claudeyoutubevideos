import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale6, TOTAL_FRAMES_DALE6 } from "./VideoEdit/Main_dale6";

const RootDale6: React.FC = () => (
  <Composition id="Dale6" component={MainDale6} durationInFrames={TOTAL_FRAMES_DALE6} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale6);
