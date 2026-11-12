import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12b, TOTAL_FRAMES_STAN12B } from "./stan12b/Main";
import { KitTest, KIT_FRAMES } from "./stan12b/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Stan12b" component={MainStan12b} durationInFrames={TOTAL_FRAMES_STAN12B} fps={30} width={1920} height={1080} />
    <Composition id="Stan12bKit" component={KitTest} durationInFrames={Math.max(1, KIT_FRAMES)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
