import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./cl2heladera/Body";
// cl2heladera: el video entero es un solo hilo (Body): avatar ↔ piezas ↔ planos Veo/fotos ↔ la heladera de vidrio
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
