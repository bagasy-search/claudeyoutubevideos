import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainAbuela3, TOTAL_FRAMES_ABUELA3 } from "./VideoEdit/Main_abuela3";

const RootAbuela3: React.FC = () => (
  <Composition id="Abuela3" component={MainAbuela3} durationInFrames={TOTAL_FRAMES_ABUELA3} fps={30} width={1920} height={1080} />
);
registerRoot(RootAbuela3);
