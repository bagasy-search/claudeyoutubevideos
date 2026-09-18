// index_cmecaja.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmecaja, TOTAL_FRAMES_CMECAJA } from "./cmecaja/Main_cmecaja";

const Root: React.FC = () => (
  <Composition id="Cmecaja" component={MainCmecaja}
    durationInFrames={TOTAL_FRAMES_CMECAJA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
