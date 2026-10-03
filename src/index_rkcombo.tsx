import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkcombo, TOTAL_FRAMES_RKCOMBO } from "./VideoEdit/Main_rkcombo";

const RootRkcombo: React.FC = () => (
  <Composition id="Rkcombo" component={MainRkcombo} durationInFrames={TOTAL_FRAMES_RKCOMBO} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkcombo);
