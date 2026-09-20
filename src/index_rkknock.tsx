import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkknock, TOTAL_FRAMES_RKKNOCK } from "./VideoEdit/Main_rkknock";

const RootRkknock: React.FC = () => (
  <Composition id="Rkknock" component={MainRkknock} durationInFrames={TOTAL_FRAMES_RKKNOCK} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkknock);
