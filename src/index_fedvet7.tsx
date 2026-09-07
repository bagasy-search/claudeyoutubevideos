import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFedvet7, TOTAL_FRAMES_FEDVET7 } from "./VideoEdit/Main_fedvet7";

const RootFedvet7: React.FC = () => (
  <Composition id="Fedvet7" component={MainFedvet7} durationInFrames={TOTAL_FRAMES_FEDVET7} fps={30} width={1920} height={1080} />
);
registerRoot(RootFedvet7);
