import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkmorning, TOTAL_FRAMES_RKMORNING } from "./VideoEdit/Main_rkmorning";

const RootRkmorning: React.FC = () => (
  <Composition id="Rkmorning" component={MainRkmorning} durationInFrames={TOTAL_FRAMES_RKMORNING} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkmorning);
