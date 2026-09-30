// index_tdccobre.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdccobre, TOTAL_FRAMES_TDCCOBRE } from "./tdccobre/Main_tdccobre";

const Root: React.FC = () => (
  <Composition id="Tdccobre" component={MainTdccobre}
    durationInFrames={TOTAL_FRAMES_TDCCOBRE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
