import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrcollagen, TOTAL_FRAMES_NRCOLLAGEN } from "./_fed6/VideoEdit/Main_nrcollagen";

const RootNrcollagen: React.FC = () => (
  <Composition id="Nrcollagen" component={MainNrcollagen} durationInFrames={TOTAL_FRAMES_NRCOLLAGEN} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrcollagen);
