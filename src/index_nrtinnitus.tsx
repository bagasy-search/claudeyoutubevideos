import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrtinnitus, TOTAL_FRAMES_NRTINNITUS } from "./_fed6/VideoEdit/Main_nrtinnitus";

const RootNrtinnitus: React.FC = () => (
  <Composition id="Nrtinnitus" component={MainNrtinnitus} durationInFrames={TOTAL_FRAMES_NRTINNITUS} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrtinnitus);
