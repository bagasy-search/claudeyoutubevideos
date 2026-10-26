// The Last Census · Ep.4 (sesión lc-b). Comp "Full" = el episodio sin audio (la mezcla la pone encfin).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Lc04, LC04_DUR } from "./census/lcb/Lc04";

const Root = () => (
  <>
    <Composition id="Full" component={Lc04 as any} durationInFrames={LC04_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
