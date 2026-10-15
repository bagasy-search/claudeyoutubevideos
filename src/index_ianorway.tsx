import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainIanorway, TOTAL_FRAMES_IANORWAY } from "./VideoEdit/Main_ianorway";

const RootIanorway: React.FC = () => (
  <Composition id="Ianorway" component={MainIanorway} durationInFrames={TOTAL_FRAMES_IANORWAY} fps={30} width={1920} height={1080} />
);
registerRoot(RootIanorway);
