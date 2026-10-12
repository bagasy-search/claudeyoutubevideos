import React from "react";
import { Composition, registerRoot } from "remotion";
import { Pasada2, FULL_FRAMES } from "./suojos/Pasada2";

const Root: React.FC = () => (
  <Composition id="Pasada2" component={Pasada2} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
