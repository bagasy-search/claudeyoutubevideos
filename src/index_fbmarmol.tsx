// index_fbmarmol.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFbmarmol, TOTAL_FRAMES_FBMARMOL } from "./fbmarmol/Main_fbmarmol";

const Root: React.FC = () => (
  <Composition id="Fbmarmol" component={MainFbmarmol}
    durationInFrames={TOTAL_FRAMES_FBMARMOL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
