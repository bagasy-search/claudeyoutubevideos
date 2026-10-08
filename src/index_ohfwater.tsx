// index_ohfwater.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOhfwater, TOTAL_FRAMES_OHFWATER } from "./ohfwater/Main_ohfwater";

const Root: React.FC = () => (
  <Composition id="Ohfwater" component={MainOhfwater}
    durationInFrames={TOTAL_FRAMES_OHFWATER} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
