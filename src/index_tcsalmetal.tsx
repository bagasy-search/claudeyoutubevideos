import "./tcsalmetal/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTcsalmetal, TOTAL_FRAMES_TCSALMETAL } from "./VideoEdit/Main_tcsalmetal";

const RootTcsalmetal: React.FC = () => (
  <Composition id="Tcsalmetal" component={MainTcsalmetal} durationInFrames={TOTAL_FRAMES_TCSALMETAL} fps={30} width={1920} height={1080} />
);
registerRoot(RootTcsalmetal);
