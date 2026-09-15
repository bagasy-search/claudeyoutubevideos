import { Composition } from "remotion";
import { MainFcspies, TOTAL_FRAMES_FCSPIES } from "./fcspies/Main_fcspies";
import { registerRoot } from "remotion";
import React from "react";
const Root = () => (
  <Composition id="Fcspies" component={MainFcspies} durationInFrames={TOTAL_FRAMES_FCSPIES}
    fps={30} width={1920} height={1080} />
);
registerRoot(Root);
