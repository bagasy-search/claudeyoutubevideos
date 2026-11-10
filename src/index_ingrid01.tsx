import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainIngrid01, TOTAL_FRAMES_INGRID01 } from "./ingrid/Main";

const Root: React.FC = () => (
  <Composition id="Ingrid01" component={MainIngrid01}
    durationInFrames={TOTAL_FRAMES_INGRID01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
