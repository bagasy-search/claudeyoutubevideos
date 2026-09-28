// index_bten500k.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainBten500k, TOTAL_FRAMES_BTEN500K } from "./bten500k/Main_bten500k";

const Root: React.FC = () => (
  <Composition id="Bten500k" component={MainBten500k}
    durationInFrames={TOTAL_FRAMES_BTEN500K} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
