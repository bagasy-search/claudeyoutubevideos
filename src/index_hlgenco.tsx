// index_hlgenco.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHlgenco, TOTAL_FRAMES_HLGENCO } from "./hlgenco/Main_hlgenco";

const Root: React.FC = () => (
  <Composition id="Hlgenco" component={MainHlgenco}
    durationInFrames={TOTAL_FRAMES_HLGENCO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
