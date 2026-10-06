import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsunaclavada, TOTAL_FRAMES_FCSUNACLAVADA } from "./_fed6/VideoEdit/Main_fcsunaclavada";

const RootFcsunaclavada: React.FC = () => (
  <Composition id="Fcsunaclavada" component={MainFcsunaclavada} durationInFrames={TOTAL_FRAMES_FCSUNACLAVADA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsunaclavada);
