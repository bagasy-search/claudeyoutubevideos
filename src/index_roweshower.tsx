import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainRoweshower, TOTAL_FRAMES_ROWESHOWER } from "./roweshower/Main_roweshower";

const RootRoweshower: React.FC = () => (
  <Composition id="Roweshower" component={MainRoweshower} durationInFrames={TOTAL_FRAMES_ROWESHOWER} fps={30} width={1920} height={1080} />
);
registerRoot(RootRoweshower);
