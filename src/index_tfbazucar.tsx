// index_tfbazucar.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbazucar, TOTAL_FRAMES_TFBAZUCAR } from "./tfbazucar/Main_tfbazucar";

const Root: React.FC = () => (
  <Composition id="Tfbazucar" component={MainTfbazucar}
    durationInFrames={TOTAL_FRAMES_TFBAZUCAR} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
