import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainDom16a, TOTAL_FRAMES_DOM16A } from "./dom16a/Main";

const RootDom16a: React.FC = () => (
  <Composition id="Dom16a" component={MainDom16a} durationInFrames={TOTAL_FRAMES_DOM16A} fps={30} width={1920} height={1080} />
);
registerRoot(RootDom16a);
