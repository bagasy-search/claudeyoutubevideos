import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrcavity, TOTAL_FRAMES_NRCAVITY } from "./_fed6/VideoEdit/Main_nrcavity";

const RootNrcavity: React.FC = () => (
  <Composition id="Nrcavity" component={MainNrcavity} durationInFrames={TOTAL_FRAMES_NRCAVITY} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrcavity);
