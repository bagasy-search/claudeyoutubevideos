import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcshongos, TOTAL_FRAMES_FCSHONGOS } from "./VideoEdit/Main_fcshongos";

const RootFcshongos: React.FC = () => (
  <Composition id="Fcshongos" component={MainFcshongos} durationInFrames={TOTAL_FRAMES_FCSHONGOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcshongos);
