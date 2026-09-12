import "./tswgold/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTswgold, TOTAL_FRAMES_TSWGOLD } from "./tswgold/Main_tswgold";
const Root: React.FC = () => (
  <Composition id="Tswgold" component={MainTswgold} durationInFrames={TOTAL_FRAMES_TSWGOLD} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
