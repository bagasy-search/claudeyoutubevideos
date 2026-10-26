import React from "react";
import { Composition, registerRoot } from "remotion";
import { Ob01, OB01_FRAMES } from "./owen/ob01/Completo";

const Root = () => (
  <>
    <Composition id="Ob01" component={Ob01} durationInFrames={OB01_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Ob01Mudo" component={Ob01} durationInFrames={OB01_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
