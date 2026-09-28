// index_cbregret.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCbregret, TOTAL_FRAMES_CBREGRET } from "./cbregret/Main_cbregret";

const Root: React.FC = () => (
  <Composition id="Cbregret" component={MainCbregret}
    durationInFrames={TOTAL_FRAMES_CBREGRET} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
