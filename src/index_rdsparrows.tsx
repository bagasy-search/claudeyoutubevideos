import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRdsparrows, TOTAL_FRAMES_RDSPARROWS } from "./VideoEdit/Main_rdsparrows";

const RootRdsparrows: React.FC = () => (
  <Composition id="Rdsparrows" component={MainRdsparrows} durationInFrames={TOTAL_FRAMES_RDSPARROWS} fps={30} width={1920} height={1080} />
);
registerRoot(RootRdsparrows);
