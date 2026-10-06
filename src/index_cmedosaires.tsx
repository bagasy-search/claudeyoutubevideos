// index_cmedosaires.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmedosaires, TOTAL_FRAMES_CMEDOSAIRES } from "./cmedosaires/Main_cmedosaires";

const Root: React.FC = () => (
  <Composition id="Cmedosaires" component={MainCmedosaires}
    durationInFrames={TOTAL_FRAMES_CMEDOSAIRES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
