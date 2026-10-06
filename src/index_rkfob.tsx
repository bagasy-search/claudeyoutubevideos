import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkfob, TOTAL_FRAMES_RKFOB } from "./VideoEdit/Main_rkfob";

const RootRkfob: React.FC = () => (
  <Composition id="Rkfob" component={MainRkfob} durationInFrames={TOTAL_FRAMES_RKFOB} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkfob);
