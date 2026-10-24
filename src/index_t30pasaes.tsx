import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30pasaes, TOTAL_FRAMES_T30PASAES } from "./VideoEdit/Main_t30pasaes";

const RootT30pasaes: React.FC = () => (
  <Composition id="T30pasaes" component={MainT30pasaes} durationInFrames={TOTAL_FRAMES_T30PASAES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30pasaes);
