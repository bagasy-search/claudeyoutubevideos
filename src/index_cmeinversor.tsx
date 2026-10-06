// index_cmeinversor.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeinversor, TOTAL_FRAMES_CMEINVERSOR } from "./cmeinversor/Main_cmeinversor";

const Root: React.FC = () => (
  <Composition id="Cmeinversor" component={MainCmeinversor}
    durationInFrames={TOTAL_FRAMES_CMEINVERSOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
