import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDale5, TOTAL_FRAMES_DALE5 } from "./VideoEdit/Main_dale5";

const RootDale5: React.FC = () => (
  <Composition id="Dale5" component={MainDale5} durationInFrames={TOTAL_FRAMES_DALE5} fps={30} width={1920} height={1080} />
);
registerRoot(RootDale5);
