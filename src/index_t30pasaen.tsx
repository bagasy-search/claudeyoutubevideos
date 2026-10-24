import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30pasaen, TOTAL_FRAMES_T30PASAEN } from "./VideoEdit/Main_t30pasaen";

const RootT30pasaen: React.FC = () => (
  <Composition id="T30pasaen" component={MainT30pasaen} durationInFrames={TOTAL_FRAMES_T30PASAEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30pasaen);
