import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRksafe, TOTAL_FRAMES_RKSAFE } from "./VideoEdit/Main_rksafe";

const RootRksafe: React.FC = () => (
  <Composition id="Rksafe" component={MainRksafe} durationInFrames={TOTAL_FRAMES_RKSAFE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRksafe);
