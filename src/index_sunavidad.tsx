import React from "react";
import { registerRoot, Composition, Audio, staticFile } from "remotion";
import { Min1 } from "./sunavidad/Min1";
import { Rest400 } from "./sunavidad/Rest";

// Root unificado 0-949 s (tiempos absolutos de la voz maestra). Única pista: voz −14 LUFS. Avatar muteado.
const Full: React.FC = () => (
  <>
    <Rest400 />
    <Audio src={staticFile("sunavidad_mix.wav")} />
  </>
);

const Root: React.FC = () => (
  <>
    <Composition id="Min1" component={Min1} durationInFrames={1950} fps={30} width={1920} height={1080} />
    <Composition id="Rest400" component={Rest400} durationInFrames={12000} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={28470} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
