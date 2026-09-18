// index_tfbsilicona.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbsilicona, TOTAL_FRAMES_TFBSILICONA } from "./tfbsilicona/Main_tfbsilicona";

const Root: React.FC = () => (
  <Composition id="Tfbsilicona" component={MainTfbsilicona}
    durationInFrames={TOTAL_FRAMES_TFBSILICONA} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
