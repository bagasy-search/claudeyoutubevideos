// cltoilet · editado a mano por Claude — ENTRY propio, se renderiza local con un public mínimo (C:/rtmp_yo1/pub)
import React from "react";
import { registerRoot, Composition } from "remotion";
import { Min1, END } from "./cltoilet/yo1/Min1";
import { Full, TOTAL_S } from "./cltoilet/yo1/Full";
import GAIN from "./cltoilet/yo1/gain.json";
registerRoot(() => (
  <>
    <Composition id="Min1" component={() => <Min1 gain={GAIN as any} />} durationInFrames={Math.round(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={() => <Full gain={GAIN as any} />} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
  </>
));
