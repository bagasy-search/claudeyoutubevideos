// index_ohfice.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOhfice, TOTAL_FRAMES_OHFICE } from "./ohfice/Main_ohfice";

const Root: React.FC = () => (
  <Composition id="Ohfice" component={MainOhfice}
    durationInFrames={TOTAL_FRAMES_OHFICE} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
