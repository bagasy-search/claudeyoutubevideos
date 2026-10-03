import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRktracker, TOTAL_FRAMES_RKTRACKER } from "./VideoEdit/Main_rktracker";

const RootRktracker: React.FC = () => (
  <Composition id="Rktracker" component={MainRktracker} durationInFrames={TOTAL_FRAMES_RKTRACKER} fps={30} width={1920} height={1080} />
);
registerRoot(RootRktracker);
