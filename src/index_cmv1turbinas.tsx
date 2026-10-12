// index_cmv1turbinas.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv1turbinas, TOTAL_FRAMES_CMV1TURBINAS } from "./cmv1turbinas/Main_cmv1turbinas";

const Root: React.FC = () => (
  <Composition id="Cmv1turbinas" component={MainCmv1turbinas}
    durationInFrames={TOTAL_FRAMES_CMV1TURBINAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
