import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFb21a, TOTAL_FRAMES_FB21A } from "./fb21a/Main";

const Root: React.FC = () => (
  <Composition id="Fb21a" component={MainFb21a}
    durationInFrames={TOTAL_FRAMES_FB21A} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
