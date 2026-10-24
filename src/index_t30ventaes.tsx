import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30ventaes, TOTAL_FRAMES_T30VENTAES } from "./VideoEdit/Main_t30ventaes";

const RootT30ventaes: React.FC = () => (
  <Composition id="T30ventaes" component={MainT30ventaes} durationInFrames={TOTAL_FRAMES_T30VENTAES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30ventaes);
