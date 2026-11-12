import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan, TOTAL_FRAMES_STAN } from "./stan/Main";
import { KitTest, KIT_TOTAL } from "./stan/KitTest";

const Root: React.FC = () => (
  <>
  <Composition id="Stan12aKit" component={KitTest} durationInFrames={KIT_TOTAL} fps={30} width={1920} height={1080} />
  <Composition id="Stan12a" component={MainStan}
    durationInFrames={TOTAL_FRAMES_STAN} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
