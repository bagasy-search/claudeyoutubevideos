import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrpurpura, TOTAL_FRAMES_NRPURPURA } from "./_fed6/VideoEdit/Main_nrpurpura";

const RootNrpurpura: React.FC = () => (
  <Composition id="Nrpurpura" component={MainNrpurpura} durationInFrames={TOTAL_FRAMES_NRPURPURA} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrpurpura);
