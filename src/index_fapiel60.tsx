import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFapiel60, TOTAL_FRAMES_FAPIEL60 } from "./VideoEdit/Main_fapiel60";

const RootFapiel60: React.FC = () => (
  <Composition id="Fapiel60" component={MainFapiel60} durationInFrames={TOTAL_FRAMES_FAPIEL60} fps={30} width={1920} height={1080} />
);
registerRoot(RootFapiel60);
