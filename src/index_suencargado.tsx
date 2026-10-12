import React from "react";
import { registerRoot, Composition } from "remotion";
import { Full, FULL_SECS } from "./suencargado/Full";

// Final para el farm: visuales del Full y la voz maestra a -14 LUFS como única pista.
const Final: React.FC = () => <Full audioSrc="suencargado_mix14.wav" />;

const Root: React.FC = () => (
  <>
    <Composition id="Final" component={Final} durationInFrames={Math.round(FULL_SECS * 30)} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
