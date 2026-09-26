// index_tdcrueda.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdcrueda, TOTAL_FRAMES_TDCRUEDA } from "./tdcrueda/Main_tdcrueda";

const Root: React.FC = () => (
  <Composition id="Tdcrueda" component={MainTdcrueda}
    durationInFrames={TOTAL_FRAMES_TDCRUEDA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
