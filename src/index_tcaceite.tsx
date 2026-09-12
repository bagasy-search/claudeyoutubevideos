import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTcaceite, TOTAL_FRAMES_TCACEITE } from "./tcaceite/Main_tcaceite";
const RootTcaceite: React.FC = () => (
  <Composition id="Tcaceite" component={MainTcaceite} durationInFrames={TOTAL_FRAMES_TCACEITE} fps={30} width={1920} height={1080} />
);
registerRoot(RootTcaceite);
