// lastwarn01_es · entry (Último Aviso de la Tierra): composición "Full"
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, TOTAL_S, MapCal, Thumb } from "./lastwarn01_es/Full";
registerRoot(() => (
  <>
    <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="MapCal" component={MapCal} durationInFrames={30} fps={30} width={1920} height={1080} />
  </>
));
