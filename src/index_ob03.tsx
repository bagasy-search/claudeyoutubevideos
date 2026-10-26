import React from "react";
import { Composition, registerRoot } from "remotion";
import { Ob03, OB03_FRAMES } from "./owen/ob03/Completo";

const Root = () => (
  <>
    <Composition id="Ob03" component={Ob03} durationInFrames={OB03_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Ob03Mudo" component={Ob03} durationInFrames={OB03_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
