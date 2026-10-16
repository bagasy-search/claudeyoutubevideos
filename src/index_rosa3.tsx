// rosa3 · entry Remotion (Abuela Rosa, ro3: 25 comidas con huevo). Kit lkit + edl del plan + héroes propios del corral.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa3/edl.json";
import AV from "./rosa3/avwin.json";
import * as H from "./rosa3/heroes";

setKit({ imgDir: "img/rosa3", grain: "img/rosa3/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa3", avDir: "av/rosa3", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
