import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbvidrio, TOTAL_FRAMES } from "./tfbvidrio/Main_tfbvidrio";

const Root: React.FC = () => (
  <Composition id="Tfbvidrio" component={MainTfbvidrio} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
