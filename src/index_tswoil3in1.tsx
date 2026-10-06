import "./tswoil3in1/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTsw, TOTAL_FRAMES_TSW } from "./tswoil3in1/Main_tswoil3in1";
const Root: React.FC = () => (
  <Composition id="Tswoil3in1" component={MainTsw} durationInFrames={TOTAL_FRAMES_TSW} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
