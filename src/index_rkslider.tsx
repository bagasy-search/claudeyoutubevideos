import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkslider, TOTAL_FRAMES_RKSLIDER } from "./VideoEdit/Main_rkslider";

const RootRkslider: React.FC = () => (
  <Composition id="Rkslider" component={MainRkslider} durationInFrames={TOTAL_FRAMES_RKSLIDER} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkslider);
