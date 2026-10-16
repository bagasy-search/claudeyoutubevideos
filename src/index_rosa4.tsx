// rosa4 · entry Remotion (Abuela Rosa: Sabores de Antes · 25 comidas de pobre para sobrevivir). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa4/edl.json";
import AV from "./rosa4/avwin.json";
import * as H from "./rosa4/heroes";

setKit({ imgDir: "img/rosa4", grain: "img/rosa4/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa4", avDir: "av/rosa4", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
