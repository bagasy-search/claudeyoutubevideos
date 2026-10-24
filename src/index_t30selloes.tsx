import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30selloes, TOTAL_FRAMES_T30SELLOES } from "./VideoEdit/Main_t30selloes";

const RootT30selloes: React.FC = () => (
  <Composition id="T30selloes" component={MainT30selloes} durationInFrames={TOTAL_FRAMES_T30SELLOES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30selloes);
