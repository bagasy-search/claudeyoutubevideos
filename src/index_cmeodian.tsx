// index_cmeodian.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeodian, TOTAL_FRAMES_CMEODIAN } from "./cmeodian/Main_cmeodian";

const Root: React.FC = () => (
  <Composition id="Cmeodian" component={MainCmeodian}
    durationInFrames={TOTAL_FRAMES_CMEODIAN} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
