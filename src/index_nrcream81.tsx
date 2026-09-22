import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainNrcream81, TOTAL_FRAMES_NRCREAM81 } from "./_fed6/VideoEdit/Main_nrcream81";

const RootNrcream81: React.FC = () => (
  <Composition id="Nrcream81" component={MainNrcream81} durationInFrames={TOTAL_FRAMES_NRCREAM81} fps={30} width={1920} height={1080} />
);
registerRoot(RootNrcream81);
