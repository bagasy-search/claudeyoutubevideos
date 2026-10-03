import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkfoil, TOTAL_FRAMES_RKFOIL } from "./VideoEdit/Main_rkfoil";

const RootRkfoil: React.FC = () => (
  <Composition id="Rkfoil" component={MainRkfoil} durationInFrames={TOTAL_FRAMES_RKFOIL} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkfoil);
