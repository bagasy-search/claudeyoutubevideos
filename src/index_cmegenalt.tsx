// index_cmegenalt.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmegenalt, TOTAL_FRAMES_CMEGENALT } from "./cmegenalt/Main_cmegenalt";

const Root: React.FC = () => (
  <Composition id="Cmegenalt" component={MainCmegenalt}
    durationInFrames={TOTAL_FRAMES_CMEGENALT} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
