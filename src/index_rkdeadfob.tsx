import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkdeadfob, TOTAL_FRAMES_RKDEADFOB } from "./VideoEdit/Main_rkdeadfob";

const RootRkdeadfob: React.FC = () => (
  <Composition id="Rkdeadfob" component={MainRkdeadfob} durationInFrames={TOTAL_FRAMES_RKDEADFOB} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkdeadfob);
