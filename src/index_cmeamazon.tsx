// index_cmeamazon.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeamazon, TOTAL_FRAMES_CMEAMAZON } from "./cmeamazon/Main_cmeamazon";

const Root: React.FC = () => (
  <Composition id="Cmeamazon" component={MainCmeamazon}
    durationInFrames={TOTAL_FRAMES_CMEAMAZON} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
