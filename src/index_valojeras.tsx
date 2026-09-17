import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainValojeras, TOTAL_FRAMES_VALOJERAS } from "./valojeras/Main_valojeras";

const Root: React.FC = () => (
  <Composition id="Valojeras" component={MainValojeras} durationInFrames={TOTAL_FRAMES_VALOJERAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
