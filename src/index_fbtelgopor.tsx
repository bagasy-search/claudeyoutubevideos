// index_fbtelgopor.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFbtelgopor, TOTAL_FRAMES_FBTELGOPOR } from "./fbtelgopor/Main_fbtelgopor";

const Root: React.FC = () => (
  <Composition id="Fbtelgopor" component={MainFbtelgopor}
    durationInFrames={TOTAL_FRAMES_FBTELGOPOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
