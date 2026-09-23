import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrvaseneck, TOTAL_FRAMES_NRVASENECK } from "./_fed6/VideoEdit/Main_nrvaseneck";

const RootNrvaseneck: React.FC = () => (
  <Composition id="Nrvaseneck" component={MainNrvaseneck} durationInFrames={TOTAL_FRAMES_NRVASENECK} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrvaseneck);
