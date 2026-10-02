// index_ctrefri.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCtrefri, TOTAL_FRAMES_CTREFRI } from "./ctrefri/Main_ctrefri";

const Root: React.FC = () => (
  <Composition id="Ctrefri" component={MainCtrefri}
    durationInFrames={TOTAL_FRAMES_CTREFRI} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
