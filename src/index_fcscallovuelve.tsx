import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcscallovuelve, TOTAL_FRAMES_FCSCALLOVUELVE } from "./_fed6/VideoEdit/Main_fcscallovuelve";

const RootFcscallovuelve: React.FC = () => (
  <Composition id="Fcscallovuelve" component={MainFcscallovuelve} durationInFrames={TOTAL_FRAMES_FCSCALLOVUELVE} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcscallovuelve);
