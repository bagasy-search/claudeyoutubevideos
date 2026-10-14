import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainWbrabbits, TOTAL_FRAMES_WBRABBITS } from "./VideoEdit/Main_wbrabbits";

const RootWbrabbits: React.FC = () => (
  <Composition id="Wbrabbits" component={MainWbrabbits} durationInFrames={TOTAL_FRAMES_WBRABBITS} fps={30} width={1920} height={1080} />
);
registerRoot(RootWbrabbits);
