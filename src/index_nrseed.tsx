import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrseed, TOTAL_FRAMES_NRSEED } from "./_fed6/VideoEdit/Main_nrseed";

const RootNrseed: React.FC = () => (
  <Composition id="Nrseed" component={MainNrseed} durationInFrames={TOTAL_FRAMES_NRSEED} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrseed);
