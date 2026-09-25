// index_cmeups.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeups, TOTAL_FRAMES_CMEUPS } from "./cmeups/Main_cmeups";

const Root: React.FC = () => (
  <Composition id="Cmeups" component={MainCmeups}
    durationInFrames={TOTAL_FRAMES_CMEUPS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
