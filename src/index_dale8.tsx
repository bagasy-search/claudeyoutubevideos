import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale8, TOTAL_FRAMES_DALE8 } from "./VideoEdit/Main_dale8";

const RootDale8: React.FC = () => (
  <Composition id="Dale8" component={MainDale8} durationInFrames={TOTAL_FRAMES_DALE8} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale8);
