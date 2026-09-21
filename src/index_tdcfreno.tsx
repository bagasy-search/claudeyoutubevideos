// index_tdcfreno.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdcfreno, TOTAL_FRAMES_TDCFRENO } from "./tdcfreno/Main_tdcfreno";

const Root: React.FC = () => (
  <Composition id="Tdcfreno" component={MainTdcfreno}
    durationInFrames={TOTAL_FRAMES_TDCFRENO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
