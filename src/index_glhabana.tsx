import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainGlhabana, TOTAL_FRAMES_GLHABANA } from "./VideoEdit/Main_glhabana";

const RootGlhabana: React.FC = () => (
  <Composition id="Glhabana" component={MainGlhabana} durationInFrames={TOTAL_FRAMES_GLHABANA} fps={30} width={1920} height={1080} />
);
registerRoot(RootGlhabana);
