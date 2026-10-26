import React from "react";
import { Composition, registerRoot } from "remotion";
import { Ycn02, YCN02_FRAMES } from "./ycn/ycn02/Completo";

const Root = () => (
  <>
    <Composition id="Full" component={Ycn02} durationInFrames={YCN02_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
