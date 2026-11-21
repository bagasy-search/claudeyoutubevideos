import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainScr21a, TOTAL_FRAMES_SCR21A } from "./scr21a/Main";

const Root: React.FC = () => (
  <Composition id="Scr21a" component={MainScr21a}
    durationInFrames={TOTAL_FRAMES_SCR21A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
