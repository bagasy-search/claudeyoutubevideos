// index_valpapa.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainValpapa, TOTAL_FRAMES_VALPAPA } from "./valpapa/Main_valpapa";

const Root: React.FC = () => (
  <Composition id="Valpapa" component={MainValpapa}
    durationInFrames={TOTAL_FRAMES_VALPAPA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
