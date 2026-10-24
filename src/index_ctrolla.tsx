import React from "react";
import { Composition, registerRoot } from "remotion";
import { Body, END } from "./ctrolla/Body";
// ctrolla: el video entero es un solo hilo (Body); gancho, las 12 cosas y el cierre salen del mismo motor
const Root = () => (
  <>
    <Composition id="Full" component={Body} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
