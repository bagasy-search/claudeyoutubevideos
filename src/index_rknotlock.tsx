import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRknotlock, TOTAL_FRAMES_RKNOTLOCK } from "./VideoEdit/Main_rknotlock";

const RootRknotlock: React.FC = () => (
  <Composition id="Rknotlock" component={MainRknotlock} durationInFrames={TOTAL_FRAMES_RKNOTLOCK} fps={30} width={1920} height={1080} />
);
registerRoot(RootRknotlock);
