// lou3 · entry Remotion (Lou's Diner Secrets, video 2: 25 forgotten diner breakfasts). Kit lkit + edl del plan + héroes de Lou.
import React from "react";
import { registerRoot, Composition } from "remotion";
import { setKit } from "./lkit";
import { makePlayer } from "./lkit/Player";
import EDL from "./lou3/edl.json";
import AV from "./lou3/avwin.json";
import * as H from "./lou3/heroes";

setKit({ imgDir: "img/lou3", grain: "img/lou3/grain.png", qr: "qr.jpg", cover: "book_cover.png", clipDir: "clips/lou3", avDir: "av/lou3", av: (AV as any).win });
export const Full = makePlayer(EDL as any, H as any);
const TOTAL_S = (EDL as any).end as number;

registerRoot(() => (
  <Composition id="Full" component={Full} durationInFrames={Math.round(TOTAL_S * 30)} fps={30} width={1920} height={1080} />
));
