import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12f, TOTAL_FRAMES_STAN12F } from "./stan12f/Main";
import { KitTest } from "./stan12f/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Stan12f" component={MainStan12f} durationInFrames={TOTAL_FRAMES_STAN12F} fps={30} width={1920} height={1080} />
    <Composition id="Stan12fKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
