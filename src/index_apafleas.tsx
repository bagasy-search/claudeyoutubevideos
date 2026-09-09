import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainApafleas, TOTAL_FRAMES_APAFLEAS } from "./VideoEdit/Main_apafleas";

const RootApafleas: React.FC = () => (
  <Composition id="Apafleas" component={MainApafleas} durationInFrames={TOTAL_FRAMES_APAFLEAS} fps={30} width={1920} height={1080} />
);
registerRoot(RootApafleas);
