import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcstobillo, TOTAL_FRAMES_FCSTOBILLO } from "./VideoEdit/Main_fcstobillo";

const RootFcstobillo: React.FC = () => (
  <Composition id="Fcstobillo" component={MainFcstobillo} durationInFrames={TOTAL_FRAMES_FCSTOBILLO} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcstobillo);
