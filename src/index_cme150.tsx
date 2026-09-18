// index_cme150.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCme150, TOTAL_FRAMES_CME150 } from "./cme150/Main_cme150";

const Root: React.FC = () => (
  <Composition id="Cme150" component={MainCme150}
    durationInFrames={TOTAL_FRAMES_CME150} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
