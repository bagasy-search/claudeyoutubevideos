// index_olivares3.tsx — GENERADO. entry propio para el farm.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainOlivares3, TOTAL_FRAMES_OLIVARES3 } from "./VideoEdit/Main_olivares3";
export const RootOlivares3: React.FC = () => (
  <Composition id="Olivares3" component={MainOlivares3}
    durationInFrames={TOTAL_FRAMES_OLIVARES3} fps={30} width={1920} height={1080} />
);
registerRoot(RootOlivares3);
