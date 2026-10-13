// index_cmv3barata.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmv3barata, TOTAL_FRAMES_CMV3BARATA } from "./cmv3barata/Main_cmv3barata";

const Root: React.FC = () => (
  <Composition id="Cmv3barata" component={MainCmv3barata}
    durationInFrames={TOTAL_FRAMES_CMV3BARATA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
