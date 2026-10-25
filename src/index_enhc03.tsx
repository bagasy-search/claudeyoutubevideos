import React from "react";
import { Composition, registerRoot } from "remotion";
import { Main, FULL_END } from "./enhc03/Main";
// enhc03 · el video entero en una sola composición (mismo reloj global). Render SÓLO en el farm.
const Root = () => (
  <>
    <Composition id="Enhc03" component={Main} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Main} durationInFrames={Math.round(FULL_END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
