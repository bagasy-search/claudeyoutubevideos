// rewild01 · Rewild Report: "The Dutch Left a Swamp Alone for 50 Years — Now Wild Horses Rule It" (narrador puro, sin avatar)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { makePlayer, fr } from "./rewild01/kit";
import EDL from "./rewild01/edl.json";

const Full = makePlayer(EDL as any);
const Root: React.FC = () => (
  <Composition id="Full" component={Full} durationInFrames={fr((EDL as any).end)} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
