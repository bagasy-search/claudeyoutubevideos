// The Last Census · Ep.3 (sesión lc-b). Comp "Full" = el episodio sin audio (la mezcla la pone encfin).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Lc03, LC03_DUR } from "./census/lcb/Lc03";

const Root = () => (
  <>
    <Composition id="Full" component={Lc03 as any} durationInFrames={LC03_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
