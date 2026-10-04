import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainLupepajaro, TOTAL_FRAMES_LUPEPAJARO } from "./VideoEdit/Main_lupepajaro";

const RootLupepajaro: React.FC = () => (
  <Composition id="Lupepajaro" component={MainLupepajaro} durationInFrames={TOTAL_FRAMES_LUPEPAJARO} fps={30} width={1920} height={1080} />
);
registerRoot(RootLupepajaro);
