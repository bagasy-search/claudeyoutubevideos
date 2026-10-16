// rosa1 · entry Remotion (Abuela Rosa, ro1: 25 comidas cuando comes solo, parte 2). Kit lkit + edl del plan + héroes propios del rancho.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./rosa1/edl.json";
import AV from "./rosa1/avwin.json";
import * as H from "./rosa1/heroes";

setKit({ imgDir: "img/rosa1", grain: "img/rosa1/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/rosa1", avDir: "av/rosa1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
