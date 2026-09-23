import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrfloaters, TOTAL_FRAMES_NRFLOATERS } from "./_fed6/VideoEdit/Main_nrfloaters";

const RootNrfloaters: React.FC = () => (
  <Composition id="Nrfloaters" component={MainNrfloaters} durationInFrames={TOTAL_FRAMES_NRFLOATERS} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrfloaters);
