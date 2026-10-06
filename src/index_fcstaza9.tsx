import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcstaza9, TOTAL_FRAMES_FCSTAZA9 } from "./VideoEdit/Main_fcstaza9";

const RootFcstaza9: React.FC = () => (
  <Composition id="Fcstaza9" component={MainFcstaza9} durationInFrames={TOTAL_FRAMES_FCSTAZA9} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcstaza9);
