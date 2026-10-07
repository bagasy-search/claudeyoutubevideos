// index_ohfheaton.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOhfheaton, TOTAL_FRAMES_OHFHEATON } from "./ohfheaton/Main_ohfheaton";

const Root: React.FC = () => (
  <Composition id="Ohfheaton" component={MainOhfheaton}
    durationInFrames={TOTAL_FRAMES_OHFHEATON} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
