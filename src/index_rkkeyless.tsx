import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkkeyless, TOTAL_FRAMES_RKKEYLESS } from "./VideoEdit/Main_rkkeyless";

const RootRkkeyless: React.FC = () => (
  <Composition id="Rkkeyless" component={MainRkkeyless} durationInFrames={TOTAL_FRAMES_RKKEYLESS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkkeyless);
