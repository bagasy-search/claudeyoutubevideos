import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12r, TOTAL_FRAMES_STAN12R } from "./stan12r/Main";
import { KitTest } from "./stan12r/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Stan12r" component={MainStan12r} durationInFrames={TOTAL_FRAMES_STAN12R} fps={30} width={1920} height={1080} />
    <Composition id="Stan12rKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
