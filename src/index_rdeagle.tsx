import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdeagle, TOTAL_FRAMES_RDEAGLE } from "./VideoEdit/Main_rdeagle";

const RootRdeagle: React.FC = () => (
  <Composition id="Rdeagle" component={MainRdeagle} durationInFrames={TOTAL_FRAMES_RDEAGLE} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdeagle);
