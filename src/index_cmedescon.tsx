// index_cmedescon.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmedescon, TOTAL_FRAMES_CMEDESCON } from "./cmedescon/Main_cmedescon";

const Root: React.FC = () => (
  <Composition id="Cmedescon" component={MainCmedescon}
    durationInFrames={TOTAL_FRAMES_CMEDESCON} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
