import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainTcbriquetas, TOTAL_FRAMES_TCBRIQUETAS } from "./tcbriquetas/Main_tcbriquetas";

const Root: React.FC = () => (
  <Composition id="Tcbriquetas" component={MainTcbriquetas}
    durationInFrames={TOTAL_FRAMES_TCBRIQUETAS} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
