import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainClementine01, TOTAL_FRAMES_CLEMENTINE01 } from "./clementine/Main";

const Root: React.FC = () => (
  <Composition id="Clementine01" component={MainClementine01}
    durationInFrames={TOTAL_FRAMES_CLEMENTINE01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
