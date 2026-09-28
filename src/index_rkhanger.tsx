import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkhanger, TOTAL_FRAMES_RKHANGER } from "./VideoEdit/Main_rkhanger";

const RootRkhanger: React.FC = () => (
  <Composition id="Rkhanger" component={MainRkhanger} durationInFrames={TOTAL_FRAMES_RKHANGER} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkhanger);
