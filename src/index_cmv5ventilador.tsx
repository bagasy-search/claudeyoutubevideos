// index_cmv5ventilador.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv5ventilador, TOTAL_FRAMES_CMV5VENTILADOR } from "./cmv5ventilador/Main_cmv5ventilador";

const Root: React.FC = () => (
  <Composition id="Cmv5ventilador" component={MainCmv5ventilador}
    durationInFrames={TOTAL_FRAMES_CMV5VENTILADOR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
