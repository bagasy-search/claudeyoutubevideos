import { Composition, registerRoot } from "remotion";
import React from "react";
import { MainTfbtanque, TOTAL_FRAMES_TFBTANQUE } from "./tfbtanque/Main_tfbtanque";

export const Root: React.FC = () => (
  <>
    <Composition id="Tfbtanque" component={MainTfbtanque} durationInFrames={TOTAL_FRAMES_TFBTANQUE} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
