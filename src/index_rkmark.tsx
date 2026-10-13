import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkmark, TOTAL_FRAMES_RKMARK } from "./VideoEdit/Main_rkmark";

const RootRkmark: React.FC = () => (
  <Composition id="Rkmark" component={MainRkmark} durationInFrames={TOTAL_FRAMES_RKMARK} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkmark);
