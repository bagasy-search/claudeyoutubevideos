import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRaydoor1, TOTAL_FRAMES_RAYDOOR1 } from "./VideoEdit/Main_raydoor1";

const RootRaydoor1: React.FC = () => (
  <Composition id="Raydoor1" component={MainRaydoor1} durationInFrames={TOTAL_FRAMES_RAYDOOR1} fps={30} width={1920} height={1080} />
);
registerRoot(RootRaydoor1);
