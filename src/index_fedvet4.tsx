import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvet4, TOTAL_FRAMES_FEDVET4 } from "./VideoEdit/Main_fedvet4";

const RootFedvet4: React.FC = () => (
  <Composition id="Fedvet4" component={MainFedvet4} durationInFrames={TOTAL_FRAMES_FEDVET4} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet4);
