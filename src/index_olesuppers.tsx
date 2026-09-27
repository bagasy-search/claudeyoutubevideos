// index_olesuppers.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOlesuppers, TOTAL_FRAMES_OLESUPPERS } from "./olesuppers/Main_olesuppers";

const Root: React.FC = () => (
  <Composition id="Olesuppers" component={MainOlesuppers}
    durationInFrames={TOTAL_FRAMES_OLESUPPERS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
