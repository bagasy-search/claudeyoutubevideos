import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30invies, TOTAL_FRAMES_T30INVIES } from "./VideoEdit/Main_t30invies";

const RootT30invies: React.FC = () => (
  <Composition id="T30invies" component={MainT30invies} durationInFrames={TOTAL_FRAMES_T30INVIES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30invies);
