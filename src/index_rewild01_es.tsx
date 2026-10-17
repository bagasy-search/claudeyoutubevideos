// rewild01_es · Informe Salvaje: "Holanda Dejó un Pantano Abandonado 50 Años (Ahora Lo Gobiernan Caballos Salvajes)" (narrador puro, sin avatar)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { makePlayer, fr } from "./rewild01_es/kit";
import EDL from "./rewild01_es/edl.json";

const Full = makePlayer(EDL as any);
const Root: React.FC = () => (
  <Composition id="Full" component={Full} durationInFrames={fr((EDL as any).end)} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
