// The Last Census · sesión lc-b (Ep.3 lc03 y Ep.4 lc04) + comp de prueba de sus sets.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { PruebaLcb } from "./census/lcb/PruebaLcb";
import { Lc03, LC03_DUR } from "./census/lcb/Lc03";
import { Lc04, LC04_DUR } from "./census/lcb/Lc04";

const Root = () => (
  <>
    <Composition id="PruebaLcb" component={PruebaLcb as any} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ set: "granja", x: 2200, y: 600, zoom: 0.5, sp: {} }} />
    <Composition id="Lc04" component={Lc04 as any} durationInFrames={LC04_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
    <Composition id="Lc03" component={Lc03 as any} durationInFrames={LC03_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
