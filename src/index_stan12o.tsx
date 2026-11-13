import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12o, TOTAL_FRAMES_STAN12O } from "./stan12o/Main";

const Root: React.FC = () => (
  <Composition id="Stan12o" component={MainStan12o}
    durationInFrames={TOTAL_FRAMES_STAN12O} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
