import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTeyakutia, TOTAL_FRAMES_TEYAKUTIA } from "./VideoEdit/Main_teyakutia";

const RootTeyakutia: React.FC = () => (
  <Composition id="Teyakutia" component={MainTeyakutia} durationInFrames={TOTAL_FRAMES_TEYAKUTIA} fps={30} width={1920} height={1080} />
);
registerRoot(RootTeyakutia);
