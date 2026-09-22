import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFcspuntos, TOTAL_FRAMES_FCSPUNTOS } from "./_fed6/VideoEdit/Main_fcspuntos";

const RootFcspuntos: React.FC = () => (
  <Composition id="Fcspuntos" component={MainFcspuntos} durationInFrames={TOTAL_FRAMES_FCSPUNTOS} fps={30} width={1920} height={1080} />
);
registerRoot(RootFcspuntos);
