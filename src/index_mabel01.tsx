import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainMabel01, TOTAL_FRAMES_MABEL01 } from "./mabel/Main";

const Root: React.FC = () => (
  <Composition id="Mabel01" component={MainMabel01}
    durationInFrames={TOTAL_FRAMES_MABEL01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
