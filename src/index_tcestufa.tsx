// index_tcestufa.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTcestufa, TOTAL_FRAMES_TCESTUFA } from "./tcestufa/Main_tcestufa";

const Root: React.FC = () => (
  <Composition id="Tcestufa" component={MainTcestufa}
    durationInFrames={TOTAL_FRAMES_TCESTUFA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
