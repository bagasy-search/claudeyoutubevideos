// Entry de tz-c (Tenzo Films tz05 + tz07): las comps finales y las pruebas de sets.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { PruebaTzc } from "./tenzo/tzc/PruebaTzc";
import { PruebaParabola05 } from "./tenzo/tzc/PruebaParabola05";
import { Tz05, TZ05_DUR } from "./tenzo/tzc/tz05";
import { Tz07, TZ07_DUR } from "./tenzo/tzc/tz07";

const Root = () => (
  <>
    <Composition id="Tz05" component={Tz05} durationInFrames={TZ05_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: "tz05.wav" }} />
    <Composition id="Tz07" component={Tz07} durationInFrames={TZ07_DUR} fps={30} width={1920} height={1080} defaultProps={{ audio: "tz07.wav" }} />
    <Composition id="PruebaTzc" component={PruebaTzc as any} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ set: "circo", x: 1600, y: 600, zoom: 0.8, variante: "" }} />
    <Composition id="PruebaParabola05" component={PruebaParabola05} durationInFrames={2826} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
