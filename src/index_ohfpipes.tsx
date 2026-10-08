// index_ohfpipes.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOhfpipes, TOTAL_FRAMES_OHFPIPES } from "./ohfpipes/Main_ohfpipes";

const Root: React.FC = () => (
  <Composition id="Ohfpipes" component={MainOhfpipes}
    durationInFrames={TOTAL_FRAMES_OHFPIPES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
