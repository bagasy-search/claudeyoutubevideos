import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdaral, TOTAL_FRAMES_RDARAL } from "./VideoEdit/Main_rdaral";

const RootRdaral: React.FC = () => (
  <Composition id="Rdaral" component={MainRdaral} durationInFrames={TOTAL_FRAMES_RDARAL} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdaral);
