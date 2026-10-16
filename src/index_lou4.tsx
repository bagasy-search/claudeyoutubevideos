// lou4 · entry Remotion (Lou's Diner Secrets, video 2: 25 forgotten diner breakfasts). Kit lkit + edl del plan + héroes de Lou.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./lou4/edl.json";
import AV from "./lou4/avwin.json";
import * as H from "./lou4/heroes";

setKit({ imgDir: "img/lou4", grain: "img/lou4/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/lou4", avDir: "av/lou4", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
