import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainYoko01, TOTAL_FRAMES_YOKO01 } from "./yoko/Main";

const Root: React.FC = () => (
  <Composition id="Yoko01" component={MainYoko01}
    durationInFrames={TOTAL_FRAMES_YOKO01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
