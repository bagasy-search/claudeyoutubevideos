// index_cmepaneles.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmepaneles, TOTAL_FRAMES_CMEPANELES } from "./cmepaneles/Main_cmepaneles";

const Root: React.FC = () => (
  <Composition id="Cmepaneles" component={MainCmepaneles}
    durationInFrames={TOTAL_FRAMES_CMEPANELES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
