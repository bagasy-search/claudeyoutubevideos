import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainFeettingle, TOTAL_FRAMES_FEETTINGLE } from "./feettingle/Main_feettingle";
const RootFeettingle: React.FC = () => (
  <Composition id="Feettingle" component={MainFeettingle} durationInFrames={TOTAL_FRAMES_FEETTINGLE} fps={30} width={1920} height={1080} />
);
registerRoot(RootFeettingle);
