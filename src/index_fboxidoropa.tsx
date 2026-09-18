// index_fboxidoropa.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainFboxidoropa, TOTAL_FRAMES_FBOXIDOROPA } from "./fboxidoropa/Main_fboxidoropa";

const Root: React.FC = () => (
  <Composition id="Fboxidoropa" component={MainFboxidoropa}
    durationInFrames={TOTAL_FRAMES_FBOXIDOROPA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
