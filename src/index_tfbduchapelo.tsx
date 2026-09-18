// index_tfbduchapelo.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbduchapelo, TOTAL_FRAMES_TFBDUCHAPELO } from "./tfbduchapelo/Main_tfbduchapelo";

const Root: React.FC = () => (
  <Composition id="Tfbduchapelo" component={MainTfbduchapelo}
    durationInFrames={TOTAL_FRAMES_TFBDUCHAPELO} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
