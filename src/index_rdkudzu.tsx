import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdkudzu, TOTAL_FRAMES_RDKUDZU } from "./VideoEdit/Main_rdkudzu";

const RootRdkudzu: React.FC = () => (
  <Composition id="Rdkudzu" component={MainRdkudzu} durationInFrames={TOTAL_FRAMES_RDKUDZU} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdkudzu);
