import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainApafireants, TOTAL_FRAMES_APAFIREANTS } from "./VideoEdit/Main_apafireants";

const RootApafireants: React.FC = () => (
  <Composition id="Apafireants" component={MainApafireants} durationInFrames={TOTAL_FRAMES_APAFIREANTS} fps={30} width={1920} height={1080} />
);
registerRoot(RootApafireants);
