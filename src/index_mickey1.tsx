// mickey1 · entry Remotion (Mickey's Butcher Shop, video 1: el ingrediente secreto del pot roast). Kit lkit + edl del plan + héroes propios.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./mickey1/edl.json";
import AV from "./mickey1/avwin.json";
import * as H from "./mickey1/heroes";

setKit({ imgDir: "img/mickey1", grain: "img/mickey1/th_card.jpg", qr: "img/mickey1/th_card.jpg", cover: "img/mickey1/th_card.jpg", clipDir: "clips/mickey1", avDir: "av/mickey1", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
