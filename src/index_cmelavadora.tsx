// index_cmelavadora.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmelavadora, TOTAL_FRAMES_CMELAVADORA } from "./cmelavadora/Main_cmelavadora";

const Root: React.FC = () => (
  <Composition id="Cmelavadora" component={MainCmelavadora}
    durationInFrames={TOTAL_FRAMES_CMELAVADORA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
