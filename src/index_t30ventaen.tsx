import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30ventaen, TOTAL_FRAMES_T30VENTAEN } from "./VideoEdit/Main_t30ventaen";

const RootT30ventaen: React.FC = () => (
  <Composition id="T30ventaen" component={MainT30ventaen} durationInFrames={TOTAL_FRAMES_T30VENTAEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30ventaen);
