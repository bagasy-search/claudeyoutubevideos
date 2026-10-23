import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30domen, TOTAL_FRAMES_T30DOMEN } from "./t30domen/Main_t30domen";

const RootT30domen: React.FC = () => (
  <Composition id="T30domen" component={MainT30domen} durationInFrames={TOTAL_FRAMES_T30DOMEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30domen);
