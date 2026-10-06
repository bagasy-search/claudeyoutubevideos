// index_cmerefri.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmerefri, TOTAL_FRAMES_CMEREFRI } from "./cmerefri/Main_cmerefri";

const Root: React.FC = () => (
  <Composition id="Cmerefri" component={MainCmerefri}
    durationInFrames={TOTAL_FRAMES_CMEREFRI} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
