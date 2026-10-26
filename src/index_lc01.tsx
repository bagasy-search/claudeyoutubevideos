// The Last Census · Ep.1 (lc01) — lc-a. Comps: Lc01 (con audio) y Lc01Mudo (stills / farm sin wav).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Lc01, LC01_FRAMES } from "./census/lca/lc01_Completo";

const Mudo: React.FC = () => <Lc01 audio={false} />;
const Root = () => (
  <>
    <Composition id="Lc01" component={Lc01 as any} durationInFrames={LC01_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Lc01Mudo" component={Mudo} durationInFrames={LC01_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
