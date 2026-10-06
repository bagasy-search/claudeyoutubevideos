import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcsnervios, TOTAL_FRAMES_FCSNERVIOS } from "./_fed6/VideoEdit/Main_fcsnervios";

const RootFcsnervios: React.FC = () => (
  <Composition id="Fcsnervios" component={MainFcsnervios} durationInFrames={TOTAL_FRAMES_FCSNERVIOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcsnervios);
