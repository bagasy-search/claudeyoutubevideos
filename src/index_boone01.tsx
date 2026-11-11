import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainBoone01, TOTAL_FRAMES_BOONE01 } from "./boone/Main";

const Root: React.FC = () => (
  <Composition id="Boone01" component={MainBoone01}
    durationInFrames={TOTAL_FRAMES_BOONE01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
