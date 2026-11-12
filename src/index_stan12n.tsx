import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainStan12n, TOTAL_FRAMES_STAN12N } from "./stan12n/Main";
import { KitTest } from "./stan12n/KitTest";

const Root: React.FC = () => (
  <>
    <Composition id="Stan12n" component={MainStan12n} durationInFrames={TOTAL_FRAMES_STAN12N} fps={30} width={1920} height={1080} />
    <Composition id="Stan12nKit" component={KitTest} durationInFrames={100000} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
