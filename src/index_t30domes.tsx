import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainT30domes, TOTAL_FRAMES_T30DOMES } from "./t30domes/Main";

const RootT30domes: React.FC = () => (
  <Composition id="T30domes" component={MainT30domes} durationInFrames={TOTAL_FRAMES_T30DOMES} fps={30} width={1920} height={1080} />
);
registerRoot(RootT30domes);
