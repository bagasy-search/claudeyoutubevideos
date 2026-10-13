// index_cmv6casa.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv6casa, TOTAL_FRAMES_CMV6CASA } from "./cmv6casa/Main_cmv6casa";

const Root: React.FC = () => (
  <Composition id="Cmv6casa" component={MainCmv6casa}
    durationInFrames={TOTAL_FRAMES_CMV6CASA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
