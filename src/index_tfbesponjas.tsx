import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTfbesponjas, TOTAL_FRAMES } from "./tfbesp/Main_tfbesponjas";

const Root: React.FC = () => (
  <Composition id="Tfbesponjas" component={MainTfbesponjas} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
