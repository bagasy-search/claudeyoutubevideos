import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30cablees, TOTAL_FRAMES_T30CABLEES } from "./VideoEdit/Main_t30cablees";

const RootT30cablees: React.FC = () => (
  <Composition id="T30cablees" component={MainT30cablees} durationInFrames={TOTAL_FRAMES_T30CABLEES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30cablees);
