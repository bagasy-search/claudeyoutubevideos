import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrperoxide, TOTAL_FRAMES_NRPEROXIDE } from "./_fed6/VideoEdit/Main_nrperoxide";

const RootNrperoxide: React.FC = () => (
  <Composition id="Nrperoxide" component={MainNrperoxide} durationInFrames={TOTAL_FRAMES_NRPEROXIDE} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrperoxide);
