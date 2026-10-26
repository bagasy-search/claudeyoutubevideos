// The Last Census · Ep.6 (sesión lc-c). Comp "Full" = el episodio.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Lc06, LC06 } from "./lc06/Full";

const Root = () => (
  <>
    <Composition id="Full" component={Lc06} durationInFrames={LC06.total} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
