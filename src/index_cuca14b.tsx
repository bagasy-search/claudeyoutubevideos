import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, TOTAL_FRAMES } from "./cuca14b/Main";

const Root: React.FC = () => (
  <Composition id="Cuca14b" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
