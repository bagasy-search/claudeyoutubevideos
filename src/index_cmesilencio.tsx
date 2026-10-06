import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainCmesilencio, TOTAL_FRAMES_CMESILENCIO } from "./cmesilencio/Main_cmesilencio";
const RootCmesilencio: React.FC = () => (
  <Composition id="Cmesilencio" component={MainCmesilencio} durationInFrames={TOTAL_FRAMES_CMESILENCIO} fps={30} width={1920} height={1080} />
);
registerRoot(RootCmesilencio);
