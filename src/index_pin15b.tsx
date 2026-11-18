import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPin15b, TOTAL_FRAMES_PIN15B } from "./pin15b/Main";

const Root: React.FC = () => (
  <Composition id="Pin15b" component={MainPin15b}
    durationInFrames={TOTAL_FRAMES_PIN15B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
