// rosa7 · entry Remotion (Abuela Rosa: Sabores de Antes — 25 comidas con ARROZ). Kit lkit + edl del plan + héroes propios de la cocina de Rosa.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa7/edl.json";
import AV from "./rosa7/avwin.json";
import * as H from "./rosa7/heroes";

setKit({ imgDir: "img/rosa7", grain: "img/rosa7/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa7", avDir: "av", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
