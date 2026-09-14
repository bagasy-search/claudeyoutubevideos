import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcscanas, TOTAL_FRAMES_FCSCANAS } from "./VideoEdit/Main_fcscanas";

const RootFcscanas: React.FC = () => (
  <Composition id="Fcscanas" component={MainFcscanas} durationInFrames={TOTAL_FRAMES_FCSCANAS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcscanas);
