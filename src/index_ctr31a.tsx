import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./ctr31a/Body";
// ctr31a: el video entero es un solo hilo (Body): avatar ↔ piezas ↔ clips Veo ↔ la casa de cristal
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
