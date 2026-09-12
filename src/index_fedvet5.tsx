import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvet5, TOTAL_FRAMES_FEDVET5 } from "./VideoEdit/Main_fedvet5";

const RootFedvet5: React.FC = () => (
  <Composition id="Fedvet5" component={MainFedvet5} durationInFrames={TOTAL_FRAMES_FEDVET5} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet5);
