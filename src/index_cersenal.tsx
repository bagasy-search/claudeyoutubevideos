import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSeisho01, TOTAL_FRAMES_SEISHO01 } from "./seisho/Main";

const Root: React.FC = () => (
  <Composition id="Seisho01" component={MainSeisho01}
    durationInFrames={TOTAL_FRAMES_SEISHO01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
