import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPeggy01, TOTAL_FRAMES_PEGGY01 } from "./peggy/Main";

const Root: React.FC = () => (
  <Composition id="Peggy01" component={MainPeggy01}
    durationInFrames={TOTAL_FRAMES_PEGGY01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
