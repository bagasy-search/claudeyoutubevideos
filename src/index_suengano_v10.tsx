import React from "react";
import { Composition, registerRoot } from "remotion";
import { V10Min1, V10Full } from "./suengano/V10";

// suengano v10 (edición a mano). Voz v10: 948,571 s = 28 457 cuadros.
const Root: React.FC = () => (
  <>
    <Composition id="SuenganoV10Min1" component={V10Min1} durationInFrames={Math.round(115.41 * 30)} fps={30} width={1920} height={1080} />
    <Composition id="SuenganoV10" component={V10Full} durationInFrames={28457} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
