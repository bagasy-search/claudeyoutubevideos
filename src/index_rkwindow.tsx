import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkwindow, TOTAL_FRAMES_RKWINDOW } from "./VideoEdit/Main_rkwindow";

const RootRkwindow: React.FC = () => (
  <Composition id="Rkwindow" component={MainRkwindow} durationInFrames={TOTAL_FRAMES_RKWINDOW} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkwindow);
