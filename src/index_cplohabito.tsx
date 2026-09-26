// index_cplohabito.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCplohabito, TOTAL_FRAMES_CPLOHABITO } from "./cplohabito/Main_cplohabito";

const Root: React.FC = () => (
  <Composition id="Cplohabito" component={MainCplohabito}
    durationInFrames={TOTAL_FRAMES_CPLOHABITO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
