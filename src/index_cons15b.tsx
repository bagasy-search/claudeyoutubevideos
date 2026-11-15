import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCons15b, TOTAL_FRAMES_CONS15B } from "./cons15b/Main";

const Root: React.FC = () => (
  <Composition id="Cons15b" component={MainCons15b}
    durationInFrames={TOTAL_FRAMES_CONS15B} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
