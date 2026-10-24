import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30invien, TOTAL_FRAMES_T30INVIEN } from "./VideoEdit/Main_t30invien";

const RootT30invien: React.FC = () => (
  <Composition id="T30invien" component={MainT30invien} durationInFrames={TOTAL_FRAMES_T30INVIEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30invien);
