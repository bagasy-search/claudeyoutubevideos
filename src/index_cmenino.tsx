// index_cmenino.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmenino, TOTAL_FRAMES_CMENINO } from "./cmenino/Main_cmenino";

const Root: React.FC = () => (
  <Composition id="Cmenino" component={MainCmenino}
    durationInFrames={TOTAL_FRAMES_CMENINO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
