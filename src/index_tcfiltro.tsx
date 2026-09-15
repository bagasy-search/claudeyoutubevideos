// index_tcfiltro.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTcfiltro, TOTAL_FRAMES_TCFILTRO } from "./tcfiltro/Main_tcfiltro";

const Root: React.FC = () => (
  <Composition id="Tcfiltro" component={MainTcfiltro}
    durationInFrames={TOTAL_FRAMES_TCFILTRO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
