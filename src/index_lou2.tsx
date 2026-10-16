// lou2 · entry Remotion (Lou's Diner Secrets, video 2: 25 forgotten diner breakfasts). Kit lkit + edl del plan + héroes de Lou.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./lou2/edl.json";
import AV from "./lou2/avwin.json";
import * as H from "./lou2/heroes";

setKit({ imgDir: "img/lou2", grain: "img/lou2/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/lou2", avDir: "av/lou2", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
