import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrgrayoil, TOTAL_FRAMES_NRGRAYOIL } from "./_fed6/VideoEdit/Main_nrgrayoil";

const RootNrgrayoil: React.FC = () => (
  <Composition id="Nrgrayoil" component={MainNrgrayoil} durationInFrames={TOTAL_FRAMES_NRGRAYOIL} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrgrayoil);
