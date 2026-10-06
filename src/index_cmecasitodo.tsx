// index_cmecasitodo.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmecasitodo, TOTAL_FRAMES_CMECASITODO } from "./cmecasitodo/Main_cmecasitodo";

const Root: React.FC = () => (
  <Composition id="Cmecasitodo" component={MainCmecasitodo}
    durationInFrames={TOTAL_FRAMES_CMECASITODO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
