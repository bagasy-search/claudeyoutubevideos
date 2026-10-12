import React from "react";
import { registerRoot, Composition } from "remotion";
import { Pasada2, PASADA2_SECS } from "./suencargado/Pasada2";

const Root: React.FC = () => (
  <>
    <Composition id="Pasada2" component={Pasada2} durationInFrames={Math.round(PASADA2_SECS * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
