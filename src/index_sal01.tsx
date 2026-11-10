import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainSal01, TOTAL_FRAMES_SAL01 } from "./sal/Main";

const Root: React.FC = () => (
  <Composition id="Sal01" component={MainSal01}
    durationInFrames={TOTAL_FRAMES_SAL01} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
