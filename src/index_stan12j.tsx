import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12j, TOTAL_FRAMES_STAN12J } from "./stan12j/Main";
import { KitTest } from "./stan12j/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Stan12j" component={MainStan12j} durationInFrames={TOTAL_FRAMES_STAN12J} fps={30} width={1920} height={1080} />
    <Composition id="Stan12jKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
