// index_cplonunca.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCplonunca, TOTAL_FRAMES_CPLONUNCA } from "./cplonunca/Main_cplonunca";

const Root: React.FC = () => (
  <Composition id="Cplonunca" component={MainCplonunca}
    durationInFrames={TOTAL_FRAMES_CPLONUNCA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
