// index_cmerefripaneles.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmerefripaneles, TOTAL_FRAMES_CMEREFRIPANELES } from "./cmerefripaneles/Main_cmerefripaneles";

const Root: React.FC = () => (
  <Composition id="Cmerefripaneles" component={MainCmerefripaneles}
    durationInFrames={TOTAL_FRAMES_CMEREFRIPANELES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
