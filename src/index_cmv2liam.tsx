// index_cmv2liam.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv2liam, TOTAL_FRAMES_CMV2LIAM } from "./cmv2liam/Main_cmv2liam";

const Root: React.FC = () => (
  <Composition id="Cmv2liam" component={MainCmv2liam}
    durationInFrames={TOTAL_FRAMES_CMV2LIAM} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
