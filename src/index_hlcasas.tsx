// index_hlcasas.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHlcasas, TOTAL_FRAMES_HLCASAS } from "./hlcasas/Main_hlcasas";

const Root: React.FC = () => (
  <Composition id="Hlcasas" component={MainHlcasas}
    durationInFrames={TOTAL_FRAMES_HLCASAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
