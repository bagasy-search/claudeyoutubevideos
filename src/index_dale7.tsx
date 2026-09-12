import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale7, TOTAL_FRAMES_DALE7 } from "./VideoEdit/Main_dale7";

const RootDale7: React.FC = () => (
  <Composition id="Dale7" component={MainDale7} durationInFrames={TOTAL_FRAMES_DALE7} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale7);
