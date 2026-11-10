import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainGraziella01, TOTAL_FRAMES_GRAZIELLA01 } from "./graziella/Main";

const Root: React.FC = () => (
  <Composition id="Graziella01" component={MainGraziella01}
    durationInFrames={TOTAL_FRAMES_GRAZIELLA01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
