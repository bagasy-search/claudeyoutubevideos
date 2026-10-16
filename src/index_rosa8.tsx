// rosa8 · entry Remotion (Abuela Rosa: Sabores de Antes — NUNCA vuelvas a tirar las sobras). Kit lkit + edl del plan + héroes propios de la cocina de Rosa.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa8/edl.json";
import AV from "./rosa8/avwin.json";
import * as H from "./rosa8/heroes";

setKit({ imgDir: "img/rosa8", grain: "img/rosa8/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa8", avDir: "av", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
