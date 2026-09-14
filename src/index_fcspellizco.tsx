import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcspellizco, TOTAL_FRAMES_FCSPELLIZCO } from "./VideoEdit/Main_fcspellizco";

const RootFcspellizco: React.FC = () => (
  <Composition id="Fcspellizco" component={MainFcspellizco} durationInFrames={TOTAL_FRAMES_FCSPELLIZCO} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcspellizco);
