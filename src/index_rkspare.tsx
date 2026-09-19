import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkspare, TOTAL_FRAMES_RKSPARE } from "./VideoEdit/Main_rkspare";

const RootRkspare: React.FC = () => (
  <Composition id="Rkspare" component={MainRkspare} durationInFrames={TOTAL_FRAMES_RKSPARE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkspare);
