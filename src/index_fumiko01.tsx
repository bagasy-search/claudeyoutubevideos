import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFumiko01, TOTAL_FRAMES_FUMIKO01 } from "./fumiko/Main";

const Root: React.FC = () => (
  <Composition id="Fumiko01" component={MainFumiko01}
    durationInFrames={TOTAL_FRAMES_FUMIKO01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
