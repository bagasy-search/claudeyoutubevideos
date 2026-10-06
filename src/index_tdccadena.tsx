// index_tdccadena.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTdccadena, TOTAL_FRAMES_TDCCADENA } from "./tdccadena/Main_tdccadena";

const Root: React.FC = () => (
  <Composition id="Tdccadena" component={MainTdccadena}
    durationInFrames={TOTAL_FRAMES_TDCCADENA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
