import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30cajaen, TOTAL_FRAMES_T30CAJAEN } from "./VideoEdit/Main_t30cajaen";

const RootT30cajaen: React.FC = () => (
  <Composition id="T30cajaen" component={MainT30cajaen} durationInFrames={TOTAL_FRAMES_T30CAJAEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30cajaen);
