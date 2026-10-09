// index_hlqwen3.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainHlqwen3, TOTAL_FRAMES_HLQWEN3 } from "./hlqwen3/Main_hlqwen3";

const Root: React.FC = () => (
  <Composition id="Hlqwen3" component={MainHlqwen3}
    durationInFrames={TOTAL_FRAMES_HLQWEN3} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
