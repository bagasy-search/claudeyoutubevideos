// index_hl20ds.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHl20ds, TOTAL_FRAMES_HL20DS } from "./hl20ds/Main_hl20ds";

const Root: React.FC = () => (
  <Composition id="Hl20ds" component={MainHl20ds}
    durationInFrames={TOTAL_FRAMES_HL20DS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
