// Entry MÍNIMO solo-ol30suppers (farm). Uso: ENTRY=src/index_ol30suppers.tsx — serie olworld (Ole's Camp Kitchen)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { MainOlworld } from "./olworld/MainOlworld";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./olworld/timeline_ol30suppers.gen";

const Root = () => (
  <>
    <Composition id="Ol30suppers" component={MainOlworld as any} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{ TL, OV, AUDIO }} />
  </>
);
registerRoot(Root);
