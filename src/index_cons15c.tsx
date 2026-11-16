import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCons15c, TOTAL_FRAMES_CONS15C } from "./cons15c/Main";

const Root: React.FC = () => (
  <Composition id="Cons15c" component={MainCons15c}
    durationInFrames={TOTAL_FRAMES_CONS15C} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
