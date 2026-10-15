import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdplains, TOTAL_FRAMES_RDPLAINS } from "./VideoEdit/Main_rdplains";

const RootRdplains: React.FC = () => (
  <Composition id="Rdplains" component={MainRdplains} durationInFrames={TOTAL_FRAMES_RDPLAINS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdplains);
