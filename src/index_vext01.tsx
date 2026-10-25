import React from "react";
import { Composition, registerRoot } from "remotion";
import { Clip, CLIP_FRAMES } from "./vext01/Clip";
import { TazaNueve, TAZA_FRAMES } from "./vext01/Taza";

const Root = () => (
  <>
    <Composition id="Full" component={TazaNueve} durationInFrames={TAZA_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ sonido: true }} />
    <Composition id="V1" component={Clip} durationInFrames={CLIP_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
