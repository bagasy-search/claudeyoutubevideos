import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainPinvacas, TOTAL_FRAMES_PINVACAS } from "./pinvacas/Main_pinvacas";

const Root: React.FC = () => (
  <Composition id="Pinvacas" component={MainPinvacas}
    durationInFrames={TOTAL_FRAMES_PINVACAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
