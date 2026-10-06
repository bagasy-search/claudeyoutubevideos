import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFasilla, TOTAL_FRAMES_FASILLA } from "./fasilla/Main_fasilla";

const Root: React.FC = () => (
  <Composition id="Fasilla" component={MainFasilla}
    durationInFrames={TOTAL_FRAMES_FASILLA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
