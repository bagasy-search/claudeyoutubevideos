import "./tswminioil/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTswminioil, TOTAL_FRAMES_TSWMINIOIL } from "./tswminioil/Main_tswminioil";
const Root: React.FC = () => (
  <Composition id="Tswminioil" component={MainTswminioil} durationInFrames={TOTAL_FRAMES_TSWMINIOIL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
