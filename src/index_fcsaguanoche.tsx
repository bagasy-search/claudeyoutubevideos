import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsaguanoche, TOTAL_FRAMES_FCSAGUANOCHE } from "./VideoEdit/Main_fcsaguanoche";

const RootFcsaguanoche: React.FC = () => (
  <Composition id="Fcsaguanoche" component={MainFcsaguanoche} durationInFrames={TOTAL_FRAMES_FCSAGUANOCHE} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsaguanoche);
