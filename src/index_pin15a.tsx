import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPin15a, TOTAL_FRAMES_PIN15A } from "./pin15a/Main";

const Root: React.FC = () => (
  <Composition id="Pin15a" component={MainPin15a}
    durationInFrames={TOTAL_FRAMES_PIN15A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
