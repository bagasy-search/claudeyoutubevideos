// index_cmeventilador.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmeventilador, TOTAL_FRAMES_CMEVENTILADOR } from "./cmeventilador/Main_cmeventilador";

const Root: React.FC = () => (
  <Composition id="Cmeventilador" component={MainCmeventilador}
    durationInFrames={TOTAL_FRAMES_CMEVENTILADOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
