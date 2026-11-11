import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainBernadette01, TOTAL_FRAMES_BERNADETTE01 } from "./bernadette/Main";

const Root: React.FC = () => (
  <Composition id="Bernadette01" component={MainBernadette01}
    durationInFrames={TOTAL_FRAMES_BERNADETTE01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
