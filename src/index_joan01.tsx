import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainJoan01, TOTAL_FRAMES_JOAN01 } from "./joan/Main";

const Root: React.FC = () => (
  <Composition id="Joan01" component={MainJoan01}
    durationInFrames={TOTAL_FRAMES_JOAN01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
