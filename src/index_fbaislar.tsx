// index_fbaislar.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFbaislar, TOTAL_FRAMES_FBAISLAR } from "./fbaislar/Main_fbaislar";

const Root: React.FC = () => (
  <Composition id="Fbaislar" component={MainFbaislar}
    durationInFrames={TOTAL_FRAMES_FBAISLAR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
