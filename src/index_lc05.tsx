// The Last Census · Ep.5 (sesión lc-c). Comp "Full" = el episodio; "PruebaLcc" = stills de sets.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { PruebaLcc } from "./census/lcc/Prueba";
import { Lc05, LC05 } from "./lc05/Full";

const Root = () => (
  <>
    <Composition id="Full" component={Lc05} durationInFrames={LC05.total} fps={30} width={1920} height={1080} />
    <Composition id="PruebaLcc" component={PruebaLcc as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ set: "farmacia", x: 1600, y: 560, zoom: 0.55, sp: {} }} />
  </>
);
registerRoot(Root);
