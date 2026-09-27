// index_olewinter.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOlewinter, TOTAL_FRAMES_OLEWINTER } from "./olewinter/Main_olewinter";

const Root: React.FC = () => (
  <Composition id="Olewinter" component={MainOlewinter}
    durationInFrames={TOTAL_FRAMES_OLEWINTER} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
