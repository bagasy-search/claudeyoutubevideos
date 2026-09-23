import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrtongue, TOTAL_FRAMES_NRTONGUE } from "./_fed6/VideoEdit/Main_nrtongue";

const RootNrtongue: React.FC = () => (
  <Composition id="Nrtongue" component={MainNrtongue} durationInFrames={TOTAL_FRAMES_NRTONGUE} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrtongue);
