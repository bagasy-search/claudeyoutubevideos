// index_tdcdesmal.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdcdesmal, TOTAL_FRAMES_TDCDESMAL } from "./tdcdesmal/Main_tdcdesmal";

const Root: React.FC = () => (
  <Composition id="Tdcdesmal" component={MainTdcdesmal}
    durationInFrames={TOTAL_FRAMES_TDCDESMAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
