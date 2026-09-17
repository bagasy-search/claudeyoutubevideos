// index_cmealter.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmealter, TOTAL_FRAMES_CMEALTER } from "./cmealter/Main_cmealter";

const Root: React.FC = () => (
  <Composition id="Cmealter" component={MainCmealter}
    durationInFrames={TOTAL_FRAMES_CMEALTER} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
