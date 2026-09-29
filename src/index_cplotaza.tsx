// index_cplotaza.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCplotaza, TOTAL_FRAMES_CPLOTAZA } from "./cplotaza/Main_cplotaza";

const Root: React.FC = () => (
  <Composition id="Cplotaza" component={MainCplotaza}
    durationInFrames={TOTAL_FRAMES_CPLOTAZA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
