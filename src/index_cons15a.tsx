import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCons15a, TOTAL_FRAMES_CONS15A } from "./cons15a/Main";

const Root: React.FC = () => (
  <Composition id="Cons15a" component={MainCons15a}
    durationInFrames={TOTAL_FRAMES_CONS15A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
