// index_tdcwok.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdcwok, TOTAL_FRAMES_TDCWOK } from "./tdcwok/Main_tdcwok";

const Root: React.FC = () => (
  <Composition id="Tdcwok" component={MainTdcwok}
    durationInFrames={TOTAL_FRAMES_TDCWOK} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
