import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainApayellow, TOTAL_FRAMES_APAYELLOW } from "./VideoEdit/Main_apayellow";

const RootApayellow: React.FC = () => (
  <Composition id="Apayellow" component={MainApayellow} durationInFrames={TOTAL_FRAMES_APAYELLOW} fps={30} width={1920} height={1080} />
);
registerRoot(RootApayellow);
