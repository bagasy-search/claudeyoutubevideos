// index_cmeniseentera.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeniseentera, TOTAL_FRAMES_CMENISEENTERA } from "./cmeniseentera/Main_cmeniseentera";

const Root: React.FC = () => (
  <Composition id="Cmeniseentera" component={MainCmeniseentera}
    durationInFrames={TOTAL_FRAMES_CMENISEENTERA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
