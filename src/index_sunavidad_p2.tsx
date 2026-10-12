import React from "react";
import { registerRoot, Composition } from "remotion";
import { Pasada2 } from "./sunavidad/Pasada2";
const Root: React.FC = () => (
  <Composition id="Pasada2" component={Pasada2} durationInFrames={28470} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
