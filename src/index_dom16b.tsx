import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDom16b, TOTAL_FRAMES_DOM16B } from "./dom16b/Main";

const RootDom16b: React.FC = () => (
  <Composition id="Dom16b" component={MainDom16b} durationInFrames={TOTAL_FRAMES_DOM16B} fps={30} width={1920} height={1080} />
);
registerRoot(RootDom16b);
