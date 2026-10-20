import React from "react";
import { Composition, registerRoot } from "remotion";
import { M1, M1_FRAMES } from "./cpestructuras/M1";
// minuto 1 v2 = mundo continuo (M1.tsx). La EDL por planos (Doc.tsx) queda para el cuerpo si hace falta.
const Root = () => (
  <>
    <Composition id="CPEFULL" component={M1} durationInFrames={M1_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: true }} />
    <Composition id="CPEPREV" component={M1} durationInFrames={M1_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ farm: false }} />
  </>
);
registerRoot(Root);
