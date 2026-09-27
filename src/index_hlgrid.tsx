// index_hlgrid.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHlgrid, TOTAL_FRAMES_HLGRID } from "./hlgrid/Main_hlgrid";

const Root: React.FC = () => (
  <Composition id="Hlgrid" component={MainHlgrid}
    durationInFrames={TOTAL_FRAMES_HLGRID} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
