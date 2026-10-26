// The Last Census · Ep.2 (lc02) — lc-a. Comps: Lc02 (con audio) y Lc02Mudo (stills / farm sin wav).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Lc02, LC02_FRAMES } from "./census/lca/lc02_Completo";

const Mudo: React.FC = () => <Lc02 audio={false} />;
const Root = () => (
  <>
    <Composition id="Lc02" component={Lc02 as any} durationInFrames={LC02_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Lc02Mudo" component={Mudo} durationInFrames={LC02_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
