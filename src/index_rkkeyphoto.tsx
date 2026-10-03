import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRkkeyphoto, TOTAL_FRAMES_RKKEYPHOTO } from "./VideoEdit/Main_rkkeyphoto";

const RootRkkeyphoto: React.FC = () => (
  <Composition id="Rkkeyphoto" component={MainRkkeyphoto} durationInFrames={TOTAL_FRAMES_RKKEYPHOTO} fps={30} width={1920} height={1080} />
);
registerRoot(RootRkkeyphoto);
