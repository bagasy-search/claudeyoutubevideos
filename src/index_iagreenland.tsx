import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainIagreenland, TOTAL_FRAMES_IAGREENLAND } from "./VideoEdit/Main_iagreenland";

const RootIagreenland: React.FC = () => (
  <Composition id="Iagreenland" component={MainIagreenland} durationInFrames={TOTAL_FRAMES_IAGREENLAND} fps={30} width={1920} height={1080} />
);
registerRoot(RootIagreenland);
