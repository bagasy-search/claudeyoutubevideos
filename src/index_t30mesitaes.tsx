import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30mesitaes, TOTAL_FRAMES_T30MESITAES } from "./VideoEdit/Main_t30mesitaes";

const RootT30mesitaes: React.FC = () => (
  <Composition id="T30mesitaes" component={MainT30mesitaes} durationInFrames={TOTAL_FRAMES_T30MESITAES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30mesitaes);
