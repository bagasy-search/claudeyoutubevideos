import React from "react";
import { Composition, registerRoot } from "remotion";
import { Ob02, OB02_FRAMES } from "./owen/ob02/Completo";

const Root = () => (
  <>
    <Composition id="Ob02" component={Ob02} durationInFrames={OB02_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: true }} />
    <Composition id="Ob02Mudo" component={Ob02} durationInFrames={OB02_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ audio: false }} />
  </>
);
registerRoot(Root);
