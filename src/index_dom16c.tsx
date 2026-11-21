import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDom16c, TOTAL_FRAMES_DOM16C } from "./dom16c/Main";

const RootDom16c: React.FC = () => (
  <Composition id="Dom16c" component={MainDom16c} durationInFrames={TOTAL_FRAMES_DOM16C} fps={30} width={1920} height={1080} />
);
registerRoot(RootDom16c);
