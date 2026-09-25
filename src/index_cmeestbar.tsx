// index_cmeestbar.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeestbar, TOTAL_FRAMES_CMEESTBAR } from "./cmeestbar/Main_cmeestbar";

const Root: React.FC = () => (
  <Composition id="Cmeestbar" component={MainCmeestbar}
    durationInFrames={TOTAL_FRAMES_CMEESTBAR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
