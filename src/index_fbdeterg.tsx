// index_fbdeterg.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFbdeterg, TOTAL_FRAMES_FBDETERG } from "./fbdeterg/Main_fbdeterg";

const Root: React.FC = () => (
  <Composition id="Fbdeterg" component={MainFbdeterg}
    durationInFrames={TOTAL_FRAMES_FBDETERG} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
