import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainGlmonaco, TOTAL_FRAMES_GLMONACO } from "./VideoEdit/Main_glmonaco";

const RootGlmonaco: React.FC = () => (
  <Composition id="Glmonaco" component={MainGlmonaco} durationInFrames={TOTAL_FRAMES_GLMONACO} fps={30} width={1920} height={1080} />
);
registerRoot(RootGlmonaco);
