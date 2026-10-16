// rosa9 · entry Remotion (Abuela Rosa: Sabores de Antes — 25 sopas de pobre). Kit lkit + edl del plan + héroes propios de la cocina de Rosa.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa9/edl.json";
import AV from "./rosa9/avwin.json";
import * as H from "./rosa9/heroes";

setKit({ imgDir: "img/rosa9", grain: "img/rosa9/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa9", avDir: "av", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
