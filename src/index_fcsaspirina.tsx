import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsaspirina, TOTAL_FRAMES_FCSASPIRINA } from "./VideoEdit/Main_fcsaspirina";

const RootFcsaspirina: React.FC = () => (
  <Composition id="Fcsaspirina" component={MainFcsaspirina} durationInFrames={TOTAL_FRAMES_FCSASPIRINA} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsaspirina);
