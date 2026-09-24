import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcscallos, TOTAL_FRAMES_FCSCALLOS } from "./_fed6/VideoEdit/Main_fcscallos";

const RootFcscallos: React.FC = () => (
  <Composition id="Fcscallos" component={MainFcscallos} durationInFrames={TOTAL_FRAMES_FCSCALLOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcscallos);
