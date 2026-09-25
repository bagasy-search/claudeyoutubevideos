// index_cmeledpinza.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeledpinza, TOTAL_FRAMES_CMELEDPINZA } from "./cmeledpinza/Main_cmeledpinza";

const Root: React.FC = () => (
  <Composition id="Cmeledpinza" component={MainCmeledpinza}
    durationInFrames={TOTAL_FRAMES_CMELEDPINZA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
