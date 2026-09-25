// index_cmeunabat.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeunabat, TOTAL_FRAMES_CMEUNABAT } from "./cmeunabat/Main_cmeunabat";

const Root: React.FC = () => (
  <Composition id="Cmeunabat" component={MainCmeunabat}
    durationInFrames={TOTAL_FRAMES_CMEUNABAT} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
