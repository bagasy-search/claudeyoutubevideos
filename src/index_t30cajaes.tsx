import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30cajaes, TOTAL_FRAMES_T30CAJAES } from "./VideoEdit/Main_t30cajaes";

const RootT30cajaes: React.FC = () => (
  <Composition id="T30cajaes" component={MainT30cajaes} durationInFrames={TOTAL_FRAMES_T30CAJAES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30cajaes);
