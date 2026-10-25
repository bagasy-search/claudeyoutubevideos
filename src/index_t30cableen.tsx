import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30cableen, TOTAL_FRAMES_T30CABLEEN } from "./VideoEdit/Main_t30cableen";

const RootT30cableen: React.FC = () => (
  <Composition id="T30cableen" component={MainT30cableen} durationInFrames={TOTAL_FRAMES_T30CABLEEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30cableen);
