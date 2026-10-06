import "./tswfan12v/index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTswfan12v, TOTAL_FRAMES_TSWFAN12V } from "./tswfan12v/Main_tswfan12v";
const Root: React.FC = () => (
  <Composition id="Tswfan12v" component={MainTswfan12v} durationInFrames={TOTAL_FRAMES_TSWFAN12V} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
