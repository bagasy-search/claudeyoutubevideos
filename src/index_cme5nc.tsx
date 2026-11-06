import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./cme5nc/Body";
// cme5nc: el video entero es un solo hilo (Body): avatar ↔ pausas ↔ ráfagas ↔ componentes ↔ planos Veo
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
