import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPincalov, TOTAL_FRAMES_PINCALOV } from "./pincalov/Main_pincalov";

const Root: React.FC = () => (
  <Composition id="Pincalov" component={MainPincalov}
    durationInFrames={TOTAL_FRAMES_PINCALOV} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
