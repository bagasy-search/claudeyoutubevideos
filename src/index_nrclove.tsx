import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrclove, TOTAL_FRAMES_NRCLOVE } from "./_fed6/VideoEdit/Main_nrclove";

const RootNrclove: React.FC = () => (
  <Composition id="Nrclove" component={MainNrclove} durationInFrames={TOTAL_FRAMES_NRCLOVE} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrclove);
