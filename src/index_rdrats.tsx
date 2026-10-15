import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdrats, TOTAL_FRAMES_RDRATS } from "./VideoEdit/Main_rdrats";

const RootRdrats: React.FC = () => (
  <Composition id="Rdrats" component={MainRdrats} durationInFrames={TOTAL_FRAMES_RDRATS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdrats);
