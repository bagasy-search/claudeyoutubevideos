import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupemadrugada, TOTAL_FRAMES_LUPEMADRUGADA } from "./VideoEdit/Main_lupemadrugada";

const RootLupemadrugada: React.FC = () => (
  <Composition id="Lupemadrugada" component={MainLupemadrugada} durationInFrames={TOTAL_FRAMES_LUPEMADRUGADA} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupemadrugada);
