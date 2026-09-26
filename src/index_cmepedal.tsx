// index_cmepedal.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmepedal, TOTAL_FRAMES_CMEPEDAL } from "./cmepedal/Main_cmepedal";

const Root: React.FC = () => (
  <Composition id="Cmepedal" component={MainCmepedal}
    durationInFrames={TOTAL_FRAMES_CMEPEDAL} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
