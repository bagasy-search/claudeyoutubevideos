import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainChiyo01, TOTAL_FRAMES_CHIYO01 } from "./chiyo/Main";

const Root: React.FC = () => (
  <Composition id="Chiyo01" component={MainChiyo01}
    durationInFrames={TOTAL_FRAMES_CHIYO01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
