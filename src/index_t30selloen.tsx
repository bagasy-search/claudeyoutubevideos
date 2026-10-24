import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30selloen, TOTAL_FRAMES_T30SELLOEN } from "./VideoEdit/Main_t30selloen";

const RootT30selloen: React.FC = () => (
  <Composition id="T30selloen" component={MainT30selloen} durationInFrames={TOTAL_FRAMES_T30SELLOEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30selloen);
