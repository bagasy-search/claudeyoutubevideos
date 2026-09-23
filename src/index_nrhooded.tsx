import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrhooded, TOTAL_FRAMES_NRHOODED } from "./_fed6/VideoEdit/Main_nrhooded";

const RootNrhooded: React.FC = () => (
  <Composition id="Nrhooded" component={MainNrhooded} durationInFrames={TOTAL_FRAMES_NRHOODED} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrhooded);
