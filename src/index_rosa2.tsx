// rosa2 · entry Remotion (Abuela Rosa, ro2: 25 comidas de una sola olla). Kit lkit + edl del plan + héroes propios del rancho.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa2/edl.json";
import AV from "./rosa2/avwin.json";
import * as H from "./rosa2/heroes";

setKit({ imgDir: "img/rosa2", grain: "img/rosa2/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa2", avDir: "av/rosa2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
