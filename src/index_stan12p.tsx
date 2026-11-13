import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12p, TOTAL_FRAMES_STAN12P } from "./stan12p/Main";

const Root: React.FC = () => (
  <Composition id="Stan12p" component={MainStan12p}
    durationInFrames={TOTAL_FRAMES_STAN12P} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
