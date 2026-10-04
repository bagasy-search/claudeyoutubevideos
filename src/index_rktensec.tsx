import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRktensec, TOTAL_FRAMES_RKTENSEC } from "./VideoEdit/Main_rktensec";

const RootRktensec: React.FC = () => (
  <Composition id="Rktensec" component={MainRktensec} durationInFrames={TOTAL_FRAMES_RKTENSEC} fps={30} width={1920} height={1080} />
);
registerRoot(RootRktensec);
