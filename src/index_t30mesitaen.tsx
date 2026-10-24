import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30mesitaen, TOTAL_FRAMES_T30MESITAEN } from "./VideoEdit/Main_t30mesitaen";

const RootT30mesitaen: React.FC = () => (
  <Composition id="T30mesitaen" component={MainT30mesitaen} durationInFrames={TOTAL_FRAMES_T30MESITAEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30mesitaen);
