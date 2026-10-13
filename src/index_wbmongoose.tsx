import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbmongoose, TOTAL_FRAMES_WBMONGOOSE } from "./VideoEdit/Main_wbmongoose";

const RootWbmongoose: React.FC = () => (
  <Composition id="Wbmongoose" component={MainWbmongoose} durationInFrames={TOTAL_FRAMES_WBMONGOOSE} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbmongoose);
