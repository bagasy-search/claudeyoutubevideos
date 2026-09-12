import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvet2, TOTAL_FRAMES_FEDVET2 } from "./VideoEdit/Main_fedvet2";

const RootFedvet2: React.FC = () => (
  <Composition id="Fedvet2" component={MainFedvet2} durationInFrames={TOTAL_FRAMES_FEDVET2} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet2);
